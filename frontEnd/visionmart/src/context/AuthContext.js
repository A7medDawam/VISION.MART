import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {apiRequest,getStoredUser,getToken,setStoredUser,setToken} from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getStoredUser());
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(Boolean(getToken()));
  const navigate = useNavigate();

  const setUser = (nextUser) => {
    setUserState(nextUser);
    setStoredUser(nextUser);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;

    apiRequest('/me')
      .then((data) => {
        if (!active) return;
        setUser(data.user || null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setToken('');
        setTokenState('');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user || null);

    return data;
  };

  const register = async (formData) => {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: formData,
    });

    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user || null);

    return data;
  };

  const logout = async () => {
    try {
      if (getToken()) {
        await apiRequest('/logout', { method: 'POST' });
      }
    } catch {}

    setToken('');
    setTokenState('');
    setUser(null);
    navigate('/');
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}