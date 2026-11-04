// Preload for `node --test`. Loads backend/.env first so the real local
// DATABASE_URL/SESSION_SECRET are used, then fills in test-only defaults for
// any variable that is still missing. Never hardcode production credentials.
import 'dotenv/config';

process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3000';
process.env.FRONTEND_URL ??= 'http://localhost:5173';
process.env.SESSION_SECRET ??= 'test-session-secret-do-not-use-in-production-123456';

if (!process.env.DATABASE_URL) {
  // Intentional failure signal: tests must run against the configured local DB.
  console.warn('[tests] DATABASE_URL is not set. Configure backend/.env or export TEST_DATABASE_URL.');
}
