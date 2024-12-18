import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = Cookies.get("accessToken");
    return !!token; // Initial state based on the presence of the token
  });
  const navigate = useNavigate();

  // Function to update the login state
  const updateLoginState = () => {
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  };

  // Keep track of cookie changes
  useEffect(() => {
    updateLoginState(); // Check login state on component mount

    const interval = setInterval(updateLoginState, 1000); // Poll for token changes

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );

      // Clear cookies and update state
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);

      navigate("/");
    } catch (error) {
      console.error("[Logout Error]", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container flex justify-between items-center p-4 mx-auto">
        <h1 className="text-2xl font-bold">I-Spardha</h1>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/"
            className="hidden md:block bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
