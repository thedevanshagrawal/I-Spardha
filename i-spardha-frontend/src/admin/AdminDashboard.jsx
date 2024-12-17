import  { useState } from "react";
import PlayerManagement from "./PlayerManagement";
import UserControll from "./UserControll";
import MatchFixture from "./MatchFixture";
import PointTable from "./PointTable";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("playermanagment");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar */}
      <div
        className={`fixed sm:relative z-50 w-64 bg-gray-800 text-white flex flex-col transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } sm:translate-x-0`}
      >
        <div className="p-6 text-lg font-bold border-b border-gray-700 flex justify-between items-center sm:block">
          
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="sm:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <button
                onClick={() => setActiveTab("playermanagment")}
                className={`block w-full text-left py-2 px-4 rounded-md ${
                  activeTab === "playermanagment" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                Player Managment
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("usercontroll")}
                className={`block w-full text-left py-2 px-4 rounded-md ${
                  activeTab === "usercontroll" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                User Controll
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("matchfixture")}
                className={`block w-full text-left py-2 px-4 rounded-md ${
                  activeTab === "matchfixture" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                Match Fixture
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("pointtable")}
                className={`block w-full text-left py-2 px-4 rounded-md ${
                  activeTab === "pointtable" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                Point Table
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-6 overflow-auto sm:ml-50">
        {activeTab === "playermanagment" && <PlayerManagement />}
        {activeTab === "usercontroll" && <UserControll />}
        {activeTab === "matchfixture" && <MatchFixture />}
        {activeTab === "pointtable" && <PointTable />}
      </div>
    </div>
  );
}

export default AdminDashboard;
