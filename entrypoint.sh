#!/bin/sh
set -e

# Sicherstellen dass DATA_DIR existiert und beschreibbar ist
DATA_DIR="${DATA_DIR:-/data}"
mkdir -p "$DATA_DIR/uploads"
echo "✓ Data directory: $DATA_DIR"

# Seed ausführen
npx tsx src/lib/seed.ts

# Next.js standalone server starten
exec node server.js

