import { useState, useEffect, useCallback } from 'react';

/**
 * useAuth — manages auth state from localStorage.
 * Placeholder: real logic will be added in Task 4.3.
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smartlink_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('smartlink_token'));
  const isAuthenticated = !!token && !!user;

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('smartlink_token', authToken);
    localStorage.setItem('smartlink_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('smartlink_token');
    localStorage.removeItem('smartlink_user');
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, isAuthenticated, login, logout };
};

/**
 * useFetch — generic fetch hook with loading and error states.
 * Placeholder: used by dashboard and analytics pages.
 */
export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err?.response?.data?.error || err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData };
};

/**
 * useLocalStorage — synced localStorage state hook.
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const toStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(toStore);
      localStorage.setItem(key, JSON.stringify(toStore));
    } catch (error) {
      console.error('useLocalStorage error:', error);
    }
  };

  return [storedValue, setValue];
};
