#!/usr/bin/env bash

set -euo pipefail

COMPOSE_FILE="./docker/docker-compose.yml"

if command -v docker-compose >/dev/null 2>&1; then
  CMD="docker-compose -f \"$COMPOSE_FILE\""
else
  CMD="docker compose -f \"$COMPOSE_FILE\""
fi

ACTION="${1:-up}"

case "$ACTION" in
  up)
    eval "$CMD build --no-cache"
    eval "$CMD up -d"
    ;;
  down)
    eval "$CMD down"
    ;;
  build)
    eval "$CMD build"
    ;;
  logs)
    eval "$CMD logs -f"
    ;;
  clean)
    eval "$CMD down -v"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Usage: $0 [up|down|build|logs|clean]"
    exit 1
    ;;
esac
