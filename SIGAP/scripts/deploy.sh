#!/usr/bin/env bash
set -Eeuo pipefail

# Run this script from the deployment directory on the VPS.
# IMAGE_TAG should be set by the GitHub Actions deployment job.
IMAGE_TAG="${IMAGE_TAG:?IMAGE_TAG is required (expected commit SHA)}"
APP_IMAGE="${APP_IMAGE:?APP_IMAGE must be set to the GHCR app image, e.g. ghcr.io/org/repo-app}"
NGINX_IMAGE="${NGINX_IMAGE:?NGINX_IMAGE must be set to the GHCR nginx image, e.g. ghcr.io/org/repo-nginx}"

export APP_IMAGE="${APP_IMAGE}:${IMAGE_TAG}"
export NGINX_IMAGE="${NGINX_IMAGE}:${IMAGE_TAG}"

# Bring up DB first and wait for its Compose healthcheck.
docker compose up -d db

# Pull the new app/web images, then run migrations before replacing app containers.
docker compose pull app nginx
docker compose run --rm app php artisan migrate --force

docker compose up -d --no-build app nginx scheduler

docker image prune -f
