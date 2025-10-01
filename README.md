docker build --build-arg VITE_LOOM_DOMAIN=$LOOM_DOMAIN -t loom-admin-panel
- docker run -p 8080:80 loom-admin-panel