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
  docker compose \
    --project-directory "$ROOT_DIR" \
    --env-file "$COMPOSE_ENV" \
    -f "$COMPOSE_FILE" "$@"
}

# Temporary override for migration-only database credentials.
MIGRATION_OVERRIDE="$(mktemp /tmp/sigap-migration-XXXXXX.yml)"
chmod 600 "$MIGRATION_OVERRIDE"

trap 'rm -f "$MIGRATION_OVERRIDE"' EXIT

cat > "$MIGRATION_OVERRIDE" <<'YAML'
services:
  app:
    environment:
      DB_USERNAME: ${MIGRATION_DB_USERNAME}
      DB_PASSWORD: ${MIGRATION_DB_PASSWORD}
YAML

# Pull release images.
compose pull app nginx

# Run migrations with the dedicated migration database user.
docker compose \
  --project-directory "$ROOT_DIR" \
  --env-file "$COMPOSE_ENV" \
  -f "$COMPOSE_FILE" \
  -f "$MIGRATION_OVERRIDE" \
  run --rm app php artisan migrate --force

# Start application services with normal Laravel runtime credentials.
compose up -d app nginx scheduler

# Keep old images for rollback.