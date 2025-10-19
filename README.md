# HPC Saviour - Mock Test Application

A comprehensive monorepo application for HPC (High Performance Computing) mock tests, built with PostgreSQL, FastAPI, and React.

## Architecture

- **Database**: PostgreSQL 16
- **Backend**: FastAPI with SQLAlchemy and Alembic
- **Frontend**: React with Vite and React Router
- **Orchestration**: Docker Compose

## Features

### Backend (FastAPI)
- Questions API for uploading MCQ questions
- Mock Test API for starting tests and evaluating answers
- SQLAlchemy with PostgreSQL
- Database initialization with init.sql
- CORS middleware for React integration
- Pydantic models with validation

### Frontend (React)
- Upload questions interface with JSON input
- Interactive mock test with multiple choice questions
- Real-time scoring and results
- Responsive design with modern UI

### Database
- PostgreSQL with persistent storage
- Question model with unique constraints
- Transaction support for bulk operations

## Quick Start

1. **Clone and navigate to the project**:
   ```bash
   cd hpc-saviour
   ```

2. **Start all services with one command**:
   ```bash
   make run
   ```
   
   Or use Docker Compose directly:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Available Commands

The project includes a Makefile for easy development:

```bash
make run          # Start all services (db, api, frontend)
make stop         # Stop all services
make clean        # Stop and remove all containers, volumes, and images
make build        # Build all services without starting
make logs         # Show logs from all services
make shell-db     # Open PostgreSQL shell
make shell-api    # Open bash shell in API container
make shell-frontend # Open bash shell in frontend container
```

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Backend Development

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Database is automatically initialized** with sample questions via init.sql

5. **Start the development server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Development

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Questions API
- `POST /questions/upload` - Upload multiple questions
- `GET /questions/` - Get all questions

### Mock Test API
- `GET /mocktest/start` - Start a new mock test
- `POST /mocktest/submit` - Submit answers and get results

## Database Schema

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text VARCHAR UNIQUE NOT NULL,
    option_a VARCHAR,
    option_b VARCHAR,
    option_c VARCHAR,
    option_d VARCHAR,
    correct_answer VARCHAR
);
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=hpc_app
DATABASE_URL=postgresql://user:password@db:5432/hpc_app

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development

# Frontend Configuration
VITE_API_URL=http://localhost:8000
```

## Usage

1. **Upload Questions**: Use the upload interface to add MCQ questions in JSON format
2. **Take Mock Test**: Start a test with randomly selected questions
3. **View Results**: Get immediate feedback with scoring and pass/fail status

## Sample Question Format

```json
[
  {
    "question_text": "What is the primary purpose of HPC?",
    "option_a": "Web development",
    "option_b": "Scientific computing",
    "option_c": "Data storage",
    "option_d": "Network management",
    "correct_answer": "Scientific computing"
  }
]
```

## Development Features

- **One-Command Setup**: `make run` starts all services instantly
- **Hot Reload**: Both FastAPI and React support live reload during development
- **CORS**: Configured for local development
- **Database Initialization**: Automatic setup with init.sql
- **Type Safety**: Pydantic models with validation and TypeScript support
- **Error Handling**: Comprehensive error handling and validation
- **Easy Management**: Makefile with commands for all common tasks

## Production Deployment

For production deployment:

1. Update environment variables for production
2. Use production database credentials
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use production-ready Docker images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
