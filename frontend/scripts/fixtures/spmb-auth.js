const user = { id: 'qa-only-user', email: 'siswa-qa@example.invalid', user_metadata: {} };
export const supabaseSiap = true;
export const ensureSupabase = () => ({ auth: {
  getSession: async () => ({ data: { session: { user } } }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
} });
