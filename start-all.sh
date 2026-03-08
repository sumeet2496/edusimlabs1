#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Starting all EduSimLabs apps..."

# Start each app in background
start_app() {
  local dir="$1"
  local name="$2"
  local port="$3"
  
  echo -e "${GREEN}Starting $name on port $port...${NC}"
  (cd "$dir" && npm run dev) &
  
  # Store the PID
  echo $! >> /tmp/edusimlabs.pids
}

# Clear PID file
> /tmp/edusimlabs.pids

# Start all apps with small delay between each
start_app main "Main Website" 3000
sleep 2

start_app fx-forward-terminal "FX Forward Terminal" 3001
sleep 2

start_app multiplayer-boardroom "Multiplayer Boardroom" 3002
sleep 2

start_app ficc-trademaster-pro "FICC Trademaster Pro" 3003
sleep 2

# Start the proxy in foreground
echo -e "${GREEN}Starting proxy on port 3011...${NC}"
npm run start:proxy

# Cleanup on exit
trap "kill $(cat /tmp/edusimlabs.pids 2>/dev/null)" EXIT
