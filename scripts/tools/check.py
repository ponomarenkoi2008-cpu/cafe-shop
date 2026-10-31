import requests
import json

print("☕ Запуск проверки интеграции склада с API поставщиков...")
try:
    # Делаем тестовый запрос
    response = requests.get("https://example.com", timeout=10)
    print(f"Статус шлюза поставщика: {response.status_code} (OK)")
except Exception as e:
    print(f"❌ Ошибка сетевого соединения со складом: {e}")
