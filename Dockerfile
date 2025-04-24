FROM node:18-slim

WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Установка зависимостей через pnpm
COPY package*.json ./
RUN pnpm install --production

# Копирование исходного кода
COPY . .

# Создаем директорию для данных
RUN mkdir -p /app/data

# Команда запуска
CMD ["node", "src/index.js"] 