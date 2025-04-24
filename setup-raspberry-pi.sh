#!/bin/bash

echo "==== Installing Pitchfork Parser on Raspberry Pi 5 ===="

# Обновляем систему
echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Устанавливаем Docker и Docker Compose
echo "Installing Docker and Docker Compose..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "Docker installed successfully!"
else
    echo "Docker already installed."
fi

# Проверяем, установлен ли Docker Compose
if ! command -v docker-compose &>/dev/null; then
    echo "Installing Docker Compose..."
    sudo apt install -y docker-compose
    echo "Docker Compose installed successfully!"
else
    echo "Docker Compose already installed."
fi

# Создаем .env файл, если он не существует
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit .env file with your API keys and settings!"
else
    echo ".env file already exists."
fi

# Создаем директорию для данных
mkdir -p data

# Запускаем Docker Compose
echo "Starting Docker containers..."
docker-compose up -d

echo "==== Installation Complete ===="
echo "The Pitchfork Parser is now running in the background."
echo "To view logs, run: docker-compose logs -f"
echo "To stop the service, run: docker-compose down"
