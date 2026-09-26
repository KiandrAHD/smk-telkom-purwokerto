const signupFields = ['nisn', 'namaLengkap', 'whatsapp', 'jurusan'];

export const getSignupBiodata = (user) => {
  const saved = user?.user_metadata?.ppdb;
  const result = { email: user?.email ?? '' };
  if (!saved || typeof saved !== 'object') return result;
  for (const key of signupFields) {
    if (typeof saved[key] === 'string') result[key] = saved[key].trim();
  }
  return result;
};

export const restoreSignupBiodata = (current, user) => {
  const saved = getSignupBiodata(user);
  const missing = Object.fromEntries(Object.entries(saved).filter(([key]) => !current[key]));
  return { ...saved, ...current, ...missing, email: saved.email };
};
