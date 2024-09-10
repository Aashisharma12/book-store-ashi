#!/bin/bash
 
# Install dependencies
pip install -r requirements.txt
 
# Collect static files
python manage.py collectstatic --no-input
 
# Migrate database
python manage.py migrate
 
# Create superuser
python manage.py createsuperuser
 
# Set environment variables (if necessary)
