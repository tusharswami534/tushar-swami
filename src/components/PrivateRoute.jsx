import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../Firebase";

const PrivateRoute = ({ children }) => {
  // Only allow access to the children (chat page) if the user is logged in
  return auth.currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
