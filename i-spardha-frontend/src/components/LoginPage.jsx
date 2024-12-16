import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        { username, password },
        { withCredentials: true }
      );

      const {
        accessToken,
        user: { role },
      } = response.data.data;

      Cookies.set("accessToken", accessToken, { secure: true });

      switch (role) {
        case "admin":
          navigate("/admindashboard");
          break;
        case "captain":
          navigate("/playerdashboard");
          break;
        case "house-representative":
          navigate("/playerdashboard");
          break;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-700 min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-6 sm:mb-8">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
