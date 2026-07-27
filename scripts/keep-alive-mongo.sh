#!/bin/bash
# keep-alive-mongo.sh - Ping MongoDB pra não dormir
# ==================================================
# Uso: ./keep-alive-mongo.sh
# Cron sugerido: 0 */6 * * * (a cada 6h)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RBNAILS_DIR="/root/rbnails"
URI="${MONGODB_URI:-}"

# Tenta carregar de .env.local (procura no projeto)
[ -z "$URI" ] && [ -f "$RBNAILS_DIR/rbnails/.env.local" ] && source "$RBNAILS_DIR/rbnails/.env.local" && URI="$MONGODB_URI"
[ -z "$URI" ] && [ -f "$RBNAILS_DIR/.env" ] && source "$RBNAILS_DIR/.env" && URI="$MONGODB_URI"
[ -z "$URI" ] && [ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env" && URI="$MONGODB_URI"

if [ -z "$URI" ]; then
  echo "❌ MONGODB_URI não definida. Exporte ou crie .env.local"
  exit 1
fi

# Usa Python com pymongo (instala via uv se necessário)
UV_BIN="$(which uv 2>/dev/null || echo "/root/.local/bin/uv")"
PYTHON_CODE='
import os, sys
uri = os.environ["MONGO_URI"]
try:
    from pymongo import MongoClient
except ImportError:
    print("⏳ Instalando pymongo...")
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "pymongo", "-q"], check=True)
    from pymongo import MongoClient

client = MongoClient(uri, serverSelectionTimeoutMS=15000)
result = client.admin.command("ping")
client.close()
print("✅ MongoDB OK -", result["ok"])
'

MONGO_URI="$URI" python3 -c "$PYTHON_CODE" 2>&1 || {
  # Fallback: uv venv temporário
  VENV_DIR=$(mktemp -d)
  uv venv "$VENV_DIR" -q
  source "$VENV_DIR/bin/activate"
  uv pip install pymongo -q
  MONGO_URI="$URI" python3 -c "$PYTHON_CODE"
  rm -rf "$VENV_DIR"
}
