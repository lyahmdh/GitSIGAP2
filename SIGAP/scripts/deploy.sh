#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="/opt/sigap"
COMPOSE_FILE="$ROOT_DIR/deployment/docker-compose.yml"
COMPOSE_ENV="$ROOT_DIR/deployment/.env"

compose() {
  docker compose \
    --project-directory "$ROOT_DIR" \
    --env-file "$COMPOSE_ENV" \
    -f "$COMPOSE_FILE" "$@"
}

echo "==> Building SIGAP Docker images locally"
compose build app nginx

echo "==> Updating SIGAP containers"
compose up -d app nginx scheduler

echo "==> Running database migrations"
compose exec -T app php artisan migrate --force

echo "==> Deployment completed"
compose ps
