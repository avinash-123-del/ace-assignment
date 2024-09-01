import React, { createContext, useState, useContext, useEffect } from 'react';
import users from '../users.json';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Stores logged-in user info
  const [userSelections, setUserSelections] = useState({}); // Stores user's dish selections

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(users));
    }

    const storedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedCurrentUser) {
      setUser(storedCurrentUser);
      setCurrentUser(storedCurrentUser);
    }
  }, []);

  const login = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    const foundUser = storedUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, currentUser, setCurrentUser, userSelections, setUserSelections }}>
      {children}
    </AuthContext.Provider>
  );
};