#!/bin/bash

# Setup script to add ADMIN_API_KEY to .env file
# Usage: ./setup-admin-key.sh

ADMIN_KEY="4ac1f825de8cb2e9dddb32ba08de8daa6f38dadf2a5595dce30a18511509340a"
ENV_FILE=".env"

cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    exit 1
fi

# Check if ADMIN_API_KEY already exists
if grep -q "^ADMIN_API_KEY=" "$ENV_FILE"; then
    echo "ADMIN_API_KEY already exists in $ENV_FILE"
    echo "Current value: $(grep "^ADMIN_API_KEY=" "$ENV_FILE")"
    read -p "Do you want to replace it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing key"
        exit 0
    fi
    # Remove existing line
    sed -i '' '/^ADMIN_API_KEY=/d' "$ENV_FILE"
fi

# Add the new key
echo "" >> "$ENV_FILE"
echo "# Admin API Key for monitoring endpoints" >> "$ENV_FILE"
echo "ADMIN_API_KEY=$ADMIN_KEY" >> "$ENV_FILE"

echo "✅ ADMIN_API_KEY added to $ENV_FILE"
echo ""
echo "You can now access monitoring endpoints with:"
echo "curl -H \"X-Admin-Key: $ADMIN_KEY\" http://localhost:10000/api/query-performance"
