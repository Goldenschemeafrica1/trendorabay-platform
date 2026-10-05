# Backend Scripts

This directory contains utility scripts for database operations, data management, and development tasks.

## Structure

```
scripts/
├── data/                   # Data insertion and population scripts
│   ├── insert_*.js        # Insert sample data
│   └── populate*.js      # Populate tables with data
├── utilities/             # Utility and helper scripts
│   ├── check_*.js        # Table validation scripts
│   ├── generate*.js      # Generation utilities
│   ├── set*.js           # Data update utilities
│   └── update*.js        # Data update scripts
├── create_*.js           # Table creation scripts (legacy)
├── add_*.js             # Column addition scripts (legacy)
└── run-*.js             # Migration runners (legacy)
```

## Usage

### Data Scripts
```bash
# Insert sample team members
node scripts/data/insert_team_members.js

# Populate gallery with sample data
node scripts/data/populateGallery.js
```

### Utility Scripts
```bash
# Check if a table exists
node scripts/utilities/checkMagazinesTable.js

# Generate a JWT secret
node scripts/utilities/generateJwtSecret.js

# Update podcast status
node scripts/utilities/updatePodcastsStatus.js
```

### Legacy Scripts
These are older scripts that have been superseded by the migration system in `../migrations/`. They are kept for backward compatibility but should be replaced with proper migrations when possible.

## Script Categories

### Data Management
- Scripts in `data/` handle inserting, updating, or populating data
- Use these for seeding development databases or data migrations

### Utilities
- Scripts in `utilities/` perform validation, checks, and maintenance tasks
- These are safe to run on production databases

### Legacy Migrations
- Older migration scripts that predate the organized migration system
- Consider migrating these to the proper `../migrations/` structure

## Best Practices

1. **Prefer migrations** over direct scripts for schema changes
2. **Test scripts** on development databases first
3. **Backup databases** before running data scripts
4. **Document scripts** with clear comments about what they do
5. **Use transactions** when making multiple related changes

## Notes

- Legacy scripts are being gradually migrated to the proper migration system
- New schema changes should use the migration system in `../migrations/`
- Data scripts should be idempotent when possible
