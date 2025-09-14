# Alumni Connect - Setup and Run Guide

## Project Overview
Alumni Connect is a comprehensive platform for managing alumni-student relationships, featuring:
- User management (Alumni, Students, Admins)
- Event management and registration
- Mentorship system
- Job posting board
- Fundraising campaigns

## Prerequisites
1. **Python 3.8+** - Download from [python.org](https://www.python.org/downloads/)
2. **pip** - Usually comes with Python
3. **Git** (optional) - For version control

## Installation Steps

### 1. Install Python
- Download Python 3.8+ from [python.org](https://www.python.org/downloads/)
- During installation, check "Add Python to PATH"
- Verify installation: `python --version`

### 2. Navigate to Project Directory
```bash
cd Alumni-Connect/backend
```

### 3. Create Virtual Environment (Recommended)
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Set Up Database
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Run Development Server
```bash
python manage.py runserver
```

The server will be available at: `http://127.0.0.1:8000/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Users
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `GET /api/alumni/` - List all alumni

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create event
- `GET /api/events/{id}/` - Get event details
- `POST /api/events/{id}/register/` - Register for event
- `GET /api/user/event-registrations/` - User's event registrations

### Mentorship
- `GET /api/mentorship-requests/` - List mentorship requests
- `POST /api/mentorship-requests/` - Create mentorship request
- `POST /api/mentorship-requests/{id}/{action}/` - Accept/reject request

### Jobs
- `GET /api/jobs/` - List job postings
- `POST /api/jobs/` - Create job posting
- `GET /api/jobs/{id}/` - Get job details

### Fundraising
- `GET /api/campaigns/` - List fundraising campaigns
- `POST /api/campaigns/` - Create campaign
- `GET /api/campaigns/{id}/` - Get campaign details
- `POST /api/campaigns/{id}/donate/` - Make donation
- `GET /api/campaigns/{id}/donations/` - List campaign donations

## Admin Panel
Access the Django admin panel at: `http://127.0.0.1:8000/admin/`

## Testing the API
You can test the API using:
1. **Django Admin Panel** - For basic CRUD operations
2. **Postman** - For API testing
3. **curl** commands - For command line testing
4. **Frontend application** - Connect your frontend to these endpoints

## Example API Usage

### Register a new user:
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "alumni",
    "batch": "2015",
    "department": "Computer Science"
  }'
```

### Login:
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepassword123"
  }'
```

## Project Structure
```
Alumni-Connect/
├── backend/
│   ├── alumni_connect/          # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── core/                    # Main app
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # DRF serializers
│   │   ├── urls.py             # URL patterns
│   │   └── admin.py            # Admin configuration
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   └── db.sqlite3             # SQLite database (created after migration)
└── README.md
```

## Troubleshooting

### Python not found
- Ensure Python is installed and added to PATH
- Try `python3` instead of `python`
- Restart your terminal after installing Python

### Module not found errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

### Database errors
- Run `python manage.py makemigrations`
- Run `python manage.py migrate`

### Port already in use
- Change port: `python manage.py runserver 8001`
- Or kill the process using port 8000

## Next Steps
1. Set up a frontend application (React, Vue, Angular, etc.)
2. Configure production settings
3. Set up a production database (PostgreSQL, MySQL)
4. Deploy to a cloud platform (Heroku, AWS, etc.)

