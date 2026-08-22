---
title: Family Hub
emoji: 🏠
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Family Hub

A family management application built with Django and React.

## Features

- Task management (Việc nhà)
- Shopping list (Mua sắm)
- Expense tracking (Chi tiêu)
- Calendar (Lịch)
- Family AI assistant
- Rewards system (Phần thưởng)
- Messages
- Settings

## Tech Stack

- Backend: Django 6.1 + Django REST Framework
- Frontend: React 19 + Vite + TypeScript + Tailwind CSS
- Database: SQLite
- Deployment: Docker on Hugging Face Spaces

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | Django secret key | Required in production |
| `DJANGO_DEBUG` | Debug mode | `False` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `*` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://127.0.0.1:5173` |

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Docker Deployment

```bash
docker build -t family-hub .
docker run -p 7860:7860 family-hub
```

The app will be available at http://localhost:7860