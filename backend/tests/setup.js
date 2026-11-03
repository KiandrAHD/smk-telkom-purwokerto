process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3000';
process.env.DATABASE_URL ??= process.env.TEST_DATABASE_URL || 'mysql://USER:PASSWORD@localhost:3306/smk_telkom_purwokerto';
process.env.FRONTEND_URL ??= 'http://localhost:5173';
process.env.SESSION_SECRET ??= 'test-session-secret-do-not-use-in-production-123456';
