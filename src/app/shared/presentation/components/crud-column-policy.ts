const BLOCKED_CRUD_COLUMNS = new Set(['id', 'deletedAt', 'updatedAt']);

export function applyCrudColumnPolicy(columns: string[]): string[] {
  return columns.filter((column) => !BLOCKED_CRUD_COLUMNS.has(column));
}
