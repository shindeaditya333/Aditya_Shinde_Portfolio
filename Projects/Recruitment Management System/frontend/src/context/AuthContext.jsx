import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  const setAuthUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    setAuthUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
