#!/bin/bash

echo "Удаление лишних файлов из проекта..."

# Удаление дублирующих файлов парсера
echo "Удаление дублирующих файлов парсера..."
rm -f src/test-tracks.js
rm -f src/index-tracks.js

# Удаление устаревших утилит
echo "Удаление устаревших утилит..."
rm -f src/get-page-structure.js
rm -f src/fetch-html.js
rm -f src/browser-test.js
rm -f src/parser.js

# Удаление временных директорий
echo "Удаление временных директорий..."
rm -rf temp
rm -rf test-output

echo "Очистка завершена!" 