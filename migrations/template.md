# Database Schema Design Template

## Table: `users`

### Purpose


### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID/INT | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Example field |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Relationships

- **Foreign Keys:**
  - `column_name` → `other_table(id)`

- **Referenced By:**
  - `other_table.foreign_key_column`

### Indexes

- `idx_table_column` on `column_name`
- `idx_table_composite` on `(column1, column2)`

### Constraints

- UNIQUE: `column_name`
- CHECK: `amount >= 0`

### Notes

- Additional considerations
- Business rules
- Performance considerations
