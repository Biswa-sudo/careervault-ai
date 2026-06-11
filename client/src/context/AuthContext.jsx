import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [token, setToken] = useState(null);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    setToken(storedToken);
  }

  setLoading(false);
}, []);

  const login = (jwtToken, userData = null) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
  token,
  user,
  loading,
  login,
  logout,
  isAuthenticated: !!token,
}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};