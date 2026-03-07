#!/bin/bash

# run.sh - Launcher for the consolidated EduSimLabs Simulation Suite

echo "Starting EduSimLabs Consolidated Suite on port 8080..."

PROJECT_DIR="/Users/sumeetsuryawanshi/Documents/Simulations Main/copy-of-main (1)"

if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    echo "Installing dependencies..."
    npm install
    echo "Launching application on http://localhost:8080"
    npm run dev
else
    echo "Error: Project directory not found at $PROJECT_DIR"
    exit 1
fi
