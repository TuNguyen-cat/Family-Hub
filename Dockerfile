FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    nodejs npm \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY frontend/package*.json /app/frontend/
RUN cd /app/frontend && npm ci

COPY frontend /app/frontend
RUN cd /app/frontend && npm run build

COPY backend /app/backend

EXPOSE 7860

CMD ["sh", "-c", "cd /app/backend && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:7860"]