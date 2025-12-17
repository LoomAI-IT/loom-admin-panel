#!/bin/bash

# ============================================
# Основная функция развертывания
# ============================================

deploy_to_server() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║            НАЧАЛО РАЗВЕРТЫВАНИЯ НА STAGE                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📦 Сервис:     $SERVICE_NAME"
    echo "🏷️  Версия:     $TAG_NAME"
    echo "🖥️  Сервер:     $STAGE_HOST"
    echo "🌐 Домен:      $STAGE_DOMAIN"
    echo ""

    # Выполняем SSH команду и выводим результат в реальном времени
    sshpass -p "$STAGE_PASSWORD" ssh -o StrictHostKeyChecking=no root@$STAGE_HOST -p 22 \
        SERVICE_NAME="$SERVICE_NAME" \
        TAG_NAME="$TAG_NAME" \
        SYSTEM_REPO="$SYSTEM_REPO" \
        SERVICE_PREFIX="$SERVICE_PREFIX" \
        STAGE_DOMAIN="$STAGE_DOMAIN" \
        bash << 'EOFMAIN'
set -e

# ============================================
# Настройка логирования на удаленном сервере
# ============================================

LOG_DIR="/var/log/deployments/$SERVICE_NAME"
LOG_FILE="$LOG_DIR/$TAG_NAME.log"

init_logging() {
    mkdir -p "$LOG_DIR"
    {
        echo "========================================"
        echo "РАЗВЕРТЫВАНИЕ НАЧАТО"
        echo "========================================"
        echo "Дата:    $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Сервис:  $SERVICE_NAME"
        echo "Версия:  $TAG_NAME"
        echo "Префикс: $SERVICE_PREFIX"
        echo "Домен:   $STAGE_DOMAIN"
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
# Операции с Git
# ============================================

save_previous_tag() {
    echo ""
    log INFO "Сохранение текущей версии для отката"
    cd loom/$SERVICE_NAME

    local previous_tag=$(git describe --tags --exact-match 2>/dev/null || echo "")

    if [ -n "$previous_tag" ]; then
        echo "$previous_tag" > /tmp/${SERVICE_NAME}_previous_tag.txt
        log SUCCESS "Сохранен тег для отката: $previous_tag"
    else
        echo "" > /tmp/${SERVICE_NAME}_previous_tag.txt
        log WARN "Предыдущий тег не найден (первый деплой)"
    fi

    cd
}

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


    docker build --build-arg VITE_LOOM_DOMAIN=https://$DEV_DOMAIN -t loom-admin-panel .
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

    save_previous_tag
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
        echo "РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО"
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

    echo "✅ Развертывание на $STAGE_HOST успешно завершено"
    echo ""
}

# ============================================
# Обработчики после развертывания
# ============================================

verify_deployment_success() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              ИТОГИ РАЗВЕРТЫВАНИЯ                           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Статус:     Успешно завершено"
    echo "📦 Сервис:     $SERVICE_NAME"
    echo "🏷️  Версия:     $TAG_NAME"
    echo "🖥️  Сервер:     $STAGE_HOST"
    echo "📁 Логи:       /var/log/deployments/$SERVICE_NAME/$TAG_NAME.log"
    echo ""
    echo "👉 Следующий шаг: Ручное тестирование"
    echo ""
}

handle_deployment_failure() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              ОШИБКА РАЗВЕРТЫВАНИЯ                          ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "❌ Статус:     Завершено с ошибкой"
    echo "📦 Сервис:     $SERVICE_NAME"
    echo "🏷️  Версия:     $TAG_NAME"
    echo "🖥️  Сервер:     $STAGE_HOST"
    echo "📁 Логи:       /var/log/deployments/$SERVICE_NAME/$TAG_NAME.log"
    echo ""
    echo "🔍 Проверьте логи выше для получения подробностей"
    echo ""
}