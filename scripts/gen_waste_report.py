import sys
from pathlib import Path

# Принимаем имя папки проекта или задаем дефолтное под кофейню
name = sys.argv[1] if len(sys.argv) > 1 else "cafe_shop"
root = Path(name)

# Разворачиваем иерархию папок по ТЗ
for folder in ["src/api", "src/recipes", "tests", "docs/supplies"]:
    (root / folder).mkdir(parents=True, exist_ok=True)

# Формируем стартовое описание системы
readme_text = f"# Модуль кофейни: {name}\n\nСкрипты автоматизации списаний и поставок склада.\n"
(root / "README.md").write_text(readme_text, encoding="utf-8")

print(f"✅ Структура модулей кофейни развернута в: {root.resolve()}")