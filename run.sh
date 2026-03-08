#!/usr/bin/env bash

# run.sh - Launcher for the consolidated EduSimLabs Simulation Suite
# starts each project on its own port and a proxy on 3011

# make sure we run from the repository root (script directory)
cd "$(dirname "$0")"

set -e

PROXY_PORT=${PROXY_PORT:-3011}

echo "Starting EduSimLabs apps with development proxy on port $PROXY_PORT"

# make sure root dependencies (proxy) are installed
npm install

start_app() {
  local dir="$1"
  local name="$2"
  echo "- installing and starting ${name}"
  (cd "${dir}" && npm install && npm run dev) &
}

start_app main "Main website (port 3000)"
start_app fx-forward-terminal "FX Forward terminal (port 3001)"
start_app multiplayer-boardroom "Multiplayer Boardroom (port 3002)"
start_app ficc-trademaster-pro "FICC Trademaster Pro (port 3003)"

# run proxy in foreground so script doesn't exit immediately (now listens on 3011)
npm run start:proxy

