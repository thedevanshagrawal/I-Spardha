import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authentication/AuthContext";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./Authentication/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import PlayerDashboard from "./player/PlayerDashboard";
import PlayerManagement from "./admin/PlayerManagement";
import UserControll from "./admin/UserControll";
import MatchFixture from "./admin/MatchFixture";
import PointTable from "./admin/PointTable";
import Footer from "./components/Footer";
import AddPlayersToFixture from "./player/AddPlayersToFixture";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex flex-col min-h-full">
      <AuthProvider>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/admindashboard"
              element={<ProtectedRoute element={<AdminDashboard />} />}
            />
            <Route
              path="/playermanagment"
              element={<ProtectedRoute element={<PlayerManagement />} />}
            />
            <Route
              path="/usercontroll"
              element={<ProtectedRoute element={<UserControll />} />}
            />
            <Route
              path="/matchfixture"
              element={<ProtectedRoute element={<MatchFixture />} />}
            />
            <Route
              path="/pointtable"
              element={<ProtectedRoute element={<PointTable />} />}
            />

            <Route
              path="/playerdashboard"
              element={<ProtectedRoute element={<PlayerDashboard />} />}
            />
              <Route
              path="/addplayertofixture"
              element={<ProtectedRoute element={<AddPlayersToFixture />} />}
            />
              <Route
              path="/showpointtable"
              element={<ProtectedRoute element={<PointTable />} />}
            />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
