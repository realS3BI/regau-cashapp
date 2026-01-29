const ADMIN_AUTH_KEY = 'adminAuth';

export const getAdminAuth = (): boolean =>
  typeof window !== 'undefined' && localStorage.getItem(ADMIN_AUTH_KEY) === 'true';

export const setAdminAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  }
};

export const clearAdminAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};
