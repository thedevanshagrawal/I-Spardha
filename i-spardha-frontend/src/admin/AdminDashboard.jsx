import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-center">
          {/* Optional content like a logo or title */}
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
            {/* <li>
              <Link
                to="/admindashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white"
              >
                Dashboard
              </Link>
            </li> */}
            <li>
              <Link
                to="/playermanagment"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white"
              >
                Player Management
              </Link>
            </li>
            <li>
              <Link
                to="/usercontroll"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white"
              >
                User Control
              </Link>
            </li>
            <li>
              <Link
                to="/matchfixture"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white"
              >
                Match Fixture
              </Link>
            </li>
            <li>
              <Link
                to="/pointtable"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white"
              >
                Points Table
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative">
        <video
          className="w-full h-full object-cover"
          loop
          muted
          autoPlay
        >
          <source src="vid1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </main>
    </div>
  );
};

export default AdminDashboard;
