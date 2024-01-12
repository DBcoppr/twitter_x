import React from "react";
import { useUserContext } from "../context/userContext";
import { Navigate, useLocation } from "react-router-dom/dist";

function PrivateRoute({ children }) {
  const { user } = useUserContext();
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  if (user || storedUser) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
}

export default PrivateRoute;
