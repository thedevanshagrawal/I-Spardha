import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

function ProtectedRoute({ element }) {
  const token = Cookies.get("accessToken"); // Check if token exists in cookies

  return token ? element : <Navigate to="/login" />;
}

export default ProtectedRoute;
