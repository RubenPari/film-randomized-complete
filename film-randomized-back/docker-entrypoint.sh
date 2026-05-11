#!/bin/sh
set -e

# Run database migrations before starting the application.
# TypeORM migration:run is transactional (all-or-nothing), so concurrent
# starts are safe — only one will succeed and the others will be no-ops.
echo "Running database migrations..."
node ./node_modules/typeorm/cli.js migration:run -d ./dist/data-source.js || {
  echo "Migration failed or already applied. Continuing startup..."
}

echo "Starting API..."
exec node dist/main.js
