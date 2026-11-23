#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="/opt/sigap"
COMPOSE_FILE="$ROOT_DIR/deployment/docker-compose.yml"
COMPOSE_ENV="$ROOT_DIR/deployment/.env"
IMAGE_TAG="${IMAGE_TAG:?IMAGE_TAG is required (commit SHA)}"
APP_IMAGE_BASE="${APP_IMAGE:?APP_IMAGE base name must be set (without tag)}"
NGINX_IMAGE_BASE="${NGINX_IMAGE:?NGINX_IMAGE base name must be set (without tag)}"

export APP_IMAGE="${APP_IMAGE_BASE}:${IMAGE_TAG}"
export NGINX_IMAGE="${NGINX_IMAGE_BASE}:${IMAGE_TAG}"

compose() {
  docker compose --project-directory "$ROOT_DIR" --env-file "$COMPOSE_ENV" -f "$COMPOSE_FILE" "$@"
}

# Pull images, migrate the existing host MySQL database, then start services.
compose pull app nginx
compose run --rm app php artisan migrate --force
compose up -d app nginx scheduler

# Intentionally no automatic image prune here to preserve rollback images.
