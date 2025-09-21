#!/bin/bash

# This script seeds the database with initial data for the student guidance platform.

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development

# Create a virtual environment and activate it
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Seed the database
python backend/app/db/seed.py

# Deactivate the virtual environment
deactivate

echo "Database seeded successfully."