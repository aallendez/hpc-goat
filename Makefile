# HPC Saviour - Makefile for easy development

.PHONY: help run stop clean build logs shell-db shell-api shell-frontend

# Default target
help:
	@echo "HPC Saviour - Available commands:"
	@echo ""
	@echo "  make run          - Start all services (db, api, frontend)"
	@echo "  make stop         - Stop all services"
	@echo "  make clean        - Stop and remove all containers, volumes, and images"
	@echo "  make build        - Build all services without starting"
	@echo "  make logs         - Show logs from all services"
	@echo "  make shell-db      - Open PostgreSQL shell"
	@echo "  make shell-api     - Open bash shell in API container"
	@echo "  make shell-frontend - Open bash shell in frontend container"
	@echo ""
	@echo "Services will be available at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend API: http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"

# Start all services
run:
	@echo "🚀 Starting HPC Saviour services..."
	@echo "📊 Database: PostgreSQL"
	@echo "🔧 Backend: FastAPI"
	@echo "⚛️  Frontend: React"
	@echo ""
	docker-compose up --build

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	docker-compose down

# Clean everything (containers, volumes, images)
clean:
	@echo "🧹 Cleaning up all Docker resources..."
	docker-compose down -v --rmi all --remove-orphans
	docker system prune -f

# Build all services without starting
build:
	@echo "🔨 Building all services..."
	docker-compose build

# Show logs from all services
logs:
	@echo "📋 Showing logs from all services..."
	docker-compose logs -f

# Open PostgreSQL shell
shell-db:
	@echo "🐘 Opening PostgreSQL shell..."
	docker-compose exec db psql -U user -d hpc_app

# Open bash shell in API container
shell-api:
	@echo "🐍 Opening bash shell in API container..."
	docker-compose exec api bash

# Open bash shell in frontend container
shell-frontend:
	@echo "⚛️  Opening bash shell in frontend container..."
	docker-compose exec frontend sh
