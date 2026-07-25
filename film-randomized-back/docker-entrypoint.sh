#!/bin/sh
set -e

# Run database migrations before starting the application.
# A failed migration must stop the release: starting the API against an
# outdated schema can corrupt data or surface runtime errors.
echo "Running database migrations..."
node ./node_modules/typeorm/cli.js migration:run -d ./dist/data-source.js

echo "Starting API..."
exec node dist/main.js
