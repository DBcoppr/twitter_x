import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedData = localStorage.getItem("user");
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUser = (value) => {
    setUser(value);
  };

  function logoutUser() {
    localStorage.removeItem("user");
    window.location = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);
