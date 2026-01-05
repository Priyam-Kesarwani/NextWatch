#!/usr/bin/env bash
# Usage: bash scripts/seed-db.sh mongodb://localhost:27017 magicstream
MONGO_URI=${1:-mongodb://localhost:27017}
DB_NAME=${2:-magicstream}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="$ROOT_DIR/magic-stream-seed-data"

if ! command -v mongoimport >/dev/null 2>&1; then
  echo "mongoimport not found. Install MongoDB Database Tools and ensure mongoimport is on your PATH." >&2
  exit 1
fi

declare -A files=(
  [genres]=genres.json
  [movies]=movies.json
  [users]=users.json
  [rankings]=rankings.json
)

for col in "${!files[@]}"; do
  file="$DATA_DIR/${files[$col]}"
  if [[ -f "$file" ]]; then
    echo "Importing $file into collection $col"
    mongoimport --uri="$MONGO_URI/$DB_NAME" --collection="$col" --file="$file" --jsonArray --drop
    if [[ $? -ne 0 ]]; then
      echo "Failed to import $file" >&2
      exit 1
    fi
  else
    echo "Skipping $file — not found"
  fi
done

echo "Seeding completed successfully."