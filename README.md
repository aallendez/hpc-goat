# HPC Goat - Mock Test Application

A simple mock test application for HPC (High Performance Computing) questions built with PostgreSQL, FastAPI, and React.

## Prerequisites

- Docker and Docker Compose
- Git

## How to Run

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd hpc-saviour
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ../frontend
   npm install
   ```

3. **Start the application**:
   ```bash
   make run
   ```
   to stop the application:
   ```bash
   make stop
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Project Structure

```
hpc-saviour/
├── backend/
│   ├── app/
│   │   ├── api/routes/     # API endpoints
│   │   ├── db/            # Database models and CRUD
│   │   └── main.py        # FastAPI application
│   ├── init.sql           # Database initialization
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── routes/        # React pages
│   │   └── root.tsx       # Main app component
│   └── package.json
├── docker-compose.yml
└── Makefile
```

## Database Schema

### Questions Table

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text VARCHAR(1000) UNIQUE NOT NULL,
    option_a VARCHAR(500),
    option_b VARCHAR(500),
    option_c VARCHAR(500),
    option_d VARCHAR(500),
    correct_answer VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Available Commands

```bash
make help         # Show available commands
make run          # Start all services
make stop         # Stop all services
make clean        # Stop and remove containers
make logs         # Show logs
```
