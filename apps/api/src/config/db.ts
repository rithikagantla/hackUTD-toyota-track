// Database disabled: no-op connector retained to avoid import errors.
export async function connectDB() {
  console.log('[db] skipped (no database configured)');
}
