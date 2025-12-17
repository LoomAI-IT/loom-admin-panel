#!/bin/bash

# ============================================
# Основная функция развертывания
# ============================================

deploy_to_server() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║            НАЧАЛО РАЗВЕРТЫВАНИЯ НА PRODUCTION              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📦 Сервис:     $SERVICE_NAME"
    echo "🏷️  Версия:     $TAG_NAME"
    echo "🖥️  Сервер:     $PROD_HOST"
    echo "🌐 Домен:      $PROD_DOMAIN"
    echo "🆔 Release ID: $RELEASE_ID"
    echo ""

    # Выполняем SSH команду и выводим результат в реальном времени
    sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no root@$PROD_HOST -p 22 \
        SERVICE_NAME="$SERVICE_NAME" \
        TAG_NAME="$TAG_NAME" \
        SYSTEM_REPO="$SYSTEM_REPO" \
        SERVICE_PREFIX="$SERVICE_PREFIX" \
        PROD_DOMAIN="$PROD_DOMAIN" \
        RELEASE_ID="$RELEASE_ID" \
        LOOM_RELEASE_TG_BOT_PREFIX="$LOOM_RELEASE_TG_BOT_PREFIX" \
        bash << 'EOFMAIN'
set -e

# ============================================
# Настройка логирования на удаленном сервере
# ============================================

LOG_DIR="/var/log/deployments/production/$SERVICE_NAME"
LOG_FILE="$LOG_DIR/$TAG_NAME.log"

init_logging() {
    mkdir -p "$LOG_DIR"
    {
        echo "========================================"
        echo "PRODUCTION РАЗВЕРТЫВАНИЕ НАЧАТО"
        echo "========================================"
        echo "Дата:       $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Сервис:     $SERVICE_NAME"
        echo "Версия:     $TAG_NAME"
        echo "Префикс:    $SERVICE_PREFIX"
        echo "Домен:      $PROD_DOMAIN"
        echo "Release ID: $RELEASE_ID"
        echo "========================================"
        echo ""
    } > "$LOG_FILE"
}

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%H:%M:%S')

    case $level in
        INFO)    local icon="ℹ️ " ;;
        SUCCESS) local icon="✅" ;;
        ERROR)   local icon="❌" ;;
        WARN)    local icon="⚠️ " ;;
        *)       local icon="  " ;;
    esac

    # Выводим в консоль (будет отображаться в GitHub)
    echo "${icon} ${message}"
    # Записываем в файл
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# ============================================
# Обновление статуса релиза
# ============================================

update_release_status_internal() {
    local new_status=$1

    if [ -z "$RELEASE_ID" ]; then
        log WARN "Release ID не передан, пропуск обновления статуса"
        return 0
    fi

    log INFO "Обновление статуса релиза: $new_status"

    local payload=$(echo '{
        "release_id": '"$RELEASE_ID"',
        "status": "'"$new_status"'"
    }' | tr -d '\n' | sed 's/  */ /g')

    local endpoint="${PROD_DOMAIN}${LOOM_RELEASE_TG_BOT_PREFIX}/release"

    local response=$(curl -s -w "\n%{http_code}" -X PATCH \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$endpoint")

    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n -1)

    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 204 ]; then
        log SUCCESS "Статус обновлен: $new_status"
    else
        log WARN "Ошибка обновления статуса [HTTP $http_code]: $body"
    fi
}

# ============================================
# Операции с Git
# ============================================

update_repository() {
    echo ""
    log INFO "Обновление репозитория"
    cd loom/$SERVICE_NAME

    local current_ref=$(git symbolic-ref --short HEAD 2>/dev/null || git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD)
    log INFO "Текущее состояние: $current_ref"

    # Удаление локального тега
    if git tag -l | grep -q "^$TAG_NAME$"; then
        log INFO "Удаление локального тега $TAG_NAME"
        git tag -d $TAG_NAME >> "$LOG_FILE" 2>&1
    fi

    # Получение обновлений (без вывода в консоль)
    log INFO "Получение обновлений из origin..."
    git fetch origin >> "$LOG_FILE" 2>&1
    git fetch origin --tags --force >> "$LOG_FILE" 2>&1

    # Проверка доступности тега
    if ! git tag -l | grep -q "^$TAG_NAME$"; then
        log ERROR "Тег $TAG_NAME не найден после получения"
        echo ""
        echo "Доступные теги (последние 10):"
        git tag -l | tail -10
        exit 1
    fi

    log SUCCESS "Тег $TAG_NAME получен успешно"
    cd
}

checkout_tag() {
    echo ""
    log INFO "Переключение на версию $TAG_NAME"
    cd loom/$SERVICE_NAME

    if git checkout $TAG_NAME >> "$LOG_FILE" 2>&1; then
        log SUCCESS "Переключено на $TAG_NAME"
    else
        log ERROR "Не удалось переключиться на $TAG_NAME"
        exit 1
    fi

    cd
}

cleanup_branches() {
    echo ""
    log INFO "Очистка старых веток"
    cd loom/$SERVICE_NAME

    local branches_deleted=$(git for-each-ref --format='%(refname:short)' refs/heads | \
        grep -v -E "^(main|master)$" | wc -l)

    if [ $branches_deleted -gt 0 ]; then
        git for-each-ref --format='%(refname:short)' refs/heads | \
            grep -v -E "^(main|master)$" | \
            xargs -r git branch -D >> "$LOG_FILE" 2>&1
        log SUCCESS "Удалено веток: $branches_deleted"
    else
        log INFO "Нет веток для удаления"
    fi

    git remote prune origin >> "$LOG_FILE" 2>&1
    cd
}

# ============================================
# Миграции базы данных
# ============================================

# ============================================
# Операции с Docker контейнерами
# ============================================

build_container() {
    echo ""
    log INFO "Сборка и запуск Docker контейнера"
    cd loom/$SERVICE_NAME


    docker build --build-arg VITE_LOOM_DOMAIN=$PROD_DOMAIN -t loom-admin-panel .
    docker stop loom-admin-panel
    docker rm loom-admin-panel
    docker run --name loom-admin-panel -d -p 3010:80 loom-admin-panel

    cd
}

# ============================================
# Основной процесс развертывания
# ============================================

main() {
    init_logging

    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║            ПРОЦЕСС РАЗВЕРТЫВАНИЯ                           ║"
    echo "╚════════════════════════════════════════════════════════════╝"

    update_repository
    checkout_tag
    cleanup_branches
    build_container

    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО УСПЕШНО! 🎉               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""

    if [ -f "/tmp/${SERVICE_NAME}_previous_tag.txt" ]; then
        local saved_tag=$(cat /tmp/${SERVICE_NAME}_previous_tag.txt)
        if [ -n "$saved_tag" ]; then
            log INFO "Для отката доступен тег: $saved_tag"
        fi
    fi

    {
        echo ""
        echo "========================================"
        echo "PRODUCTION РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО"
        echo "========================================"
        echo "Время:   $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Статус:  УСПЕШНО"
        echo "Версия:  $TAG_NAME"
        echo "========================================"
    } >> "$LOG_FILE"

    echo ""
    log INFO "📁 Полный лог сохранен: $LOG_FILE"
}

main
EOFMAIN

    local ssh_exit_code=$?

    echo ""
    if [ $ssh_exit_code -ne 0 ]; then
        echo "❌ Развертывание завершилось с ошибкой (код: $ssh_exit_code)"
        echo ""
        exit 1
    fi

    echo "✅ Развертывание на $PROD_HOST успешно завершено"
    echo ""
}

# ============================================
# Обработчики после развертывания
# ============================================

verify_deployment_success() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              ИТОГИ PRODUCTION РАЗВЕРТЫВАНИЯ                ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Статус:     Успешно завершено"
    echo "📦 Сервис:     $SERVICE_NAME"
    echo "🏷️  Версия:     $TAG_NAME"
    echo "🖥️  Сервер:     $PROD_HOST"
    echo "📁 Логи:       /var/log/deployments/production/$SERVICE_NAME/$TAG_NAME.log"
    echo ""
    echo "🎊 Сервис работает на production!"
    echo ""
}

handle_deployment_failure() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              ОШИБКА PRODUCTION РАЗВЕРТЫВАНИЯ               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "❌ Статус:     Завершено с ошибкой"
    echo "📦 Сервис:     $SERVICE_NAME"
    echo "🏷️  Версия:     $TAG_NAME"
    echo "🖥️  Сервер:     $PROD_HOST"
    echo "📁 Логи:       /var/log/deployments/production/$SERVICE_NAME/$TAG_NAME.log"
    echo ""
    echo "🔄 Проверьте, был ли выполнен автоматический откат"
    echo "🔍 Проверьте логи выше для получения подробностей"
    echo ""
}