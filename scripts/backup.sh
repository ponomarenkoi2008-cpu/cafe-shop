#!/usr/bin/env bash
# Включаем безопасный режим fail-fast
set -euo pipefail

# Папка-источник для бэкапа (аргумент 1 или текущая директория)
SRC="${1:-.}"
DEST="$HOME/backup"
STAMP=$(date +%Y-%m-%d_%H-%M)

mkdir -p "$DEST"

# Упаковываем файлы кофейни, отсекая тяжелые локальные папки зависимостей
tar -czf "$DEST/cafe_project_$STAMP.tar.gz" \
  --exclude=node_modules --exclude=.venv "$SRC"

echo "Резервная копия кофейни создана: $DEST/cafe_project_$STAMP.tar.gz"
