# HPC Goat - Mock Test Application

A simple mock test application for HPC (High Performance Computing) questions built with PostgreSQL, FastAPI, and React.

## Prerequisites

- Docker and Docker Compose
- Git
- OpenAI API Key (for automatic question classification)

## How to Run

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd hpc-saviour
   ```

2. **Set up environment variables**:
   Create a `.env` file in the project root with the following content:
   ```bash
   # Database Configuration
   DATABASE_URL=postgresql://user:password@db:5432/hpc_app
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_DB=hpc_app

   # OpenAI API Key (required for question classification)
   # Get your API key from: https://platform.openai.com/api-keys
   OPENAI_API_KEY=your-openai-api-key-here

   # Environment
   ENVIRONMENT=development

   # Frontend Configuration
   VITE_API_URL=http://localhost:8000
   ```

3. **Run database migration** (first time only):
   ```bash
   # Connect to your PostgreSQL database and run:
   psql -d hpc_app -f backend/migrate_add_topic_field.sql
   ```

4. **Start the application**:
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
