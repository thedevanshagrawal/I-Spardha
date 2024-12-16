import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <header className="w-full bg-blue-500 text-white text-center py-5 text-3xl shadow-md">
        iSpardha 2k24 - Dashboard
      </header>
      <main className="flex-grow w-full p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link
            to="/playermanagment"
            className="block p-5 bg-blue-400 text-white text-center text-xl font-bold rounded-lg shadow-md transition-transform transform hover:bg-blue-700 hover:translate-y-1"
          >
            Player Manager
          </Link>
          <Link
            to="/matchfixture"
            className="block p-5 bg-blue-400 text-white text-center text-xl font-bold rounded-lg shadow-md transition-transform transform hover:bg-blue-700 hover:translate-y-1"
          >
            Match Fixture
          </Link>
          <Link
            to="/pointtable"
            className="block p-5 bg-blue-400 text-white text-center text-xl font-bold rounded-lg shadow-md transition-transform transform hover:bg-blue-700 hover:translate-y-1"
          >
            Points Table
          </Link>
          <Link
            to="/usercontroll"
            className="block p-5 bg-blue-400 text-white text-center text-xl font-bold rounded-lg shadow-md transition-transform transform hover:bg-blue-700 hover:translate-y-1"
          >
            User Access
          </Link>
        </div>
      </main>
      
    </div>
  );
};

export default AdminDashboard;
