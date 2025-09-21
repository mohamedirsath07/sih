#!/bin/bash

# Navigate to the backend directory and start the Flask server
cd ../backend
export FLASK_APP=app.py
flask run &

# Navigate to the frontend directory and start the Vite development server
cd ../frontend
npm install
npm run dev &

# Wait for both servers to start
wait