#!/bin/bash

# start-all.sh - Launcher for EduSimLabs Simulation Suite

echo "Starting EduSimLabs Ecosystem..."

# Function to run a project on a specific port
run_project() {
    local dir=$1
    local port=$2
    local name=$3
    echo "Launching $name on port $port..."
    (cd "$dir" && npm install && npx vite --port $port --host 0.0.0.0) &
}

# 1. Main Website
run_project "./main" 5173 "Main Website"

# 2. FX Forward Terminal
run_project "./fx-forward-terminal" 5174 "FX Forward Terminal"

# 3. Multiplayer Boardroom
run_project "./multiplayer-boardroom" 5175 "Multiplayer Boardroom"

# 4. FICC Trademaster Pro
run_project "./ficc-trademaster-pro" 5176 "FICC Trademaster Pro"

echo "All simulations initializing. Access Main Website at http://localhost:5173"
wait
