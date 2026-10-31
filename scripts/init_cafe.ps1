$name = if ($args.Count -gt 0) { $args[0] } else { "cafe_shop_ps" }

foreach ($folder in "src\recipes", "tests", "docs\supplies") {
    New-Item -ItemType Directory -Force -Path "$name\$folder" | Out-Null
}

Set-Content -Path "$name\README.md" -Value "# Система кофейни (Windows PS)`n`nЛокальный скрипт генерации структуры." -Encoding UTF8
Write-Host "Структура кофейни успешно создана по пути: $((Resolve-Path $name).Path)"
