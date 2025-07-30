// import React from 'react'
// import { FaTachometerAlt } from "react-icons/fa";
// import { FaUserSecret } from "react-icons/fa";
// import { FaCog } from "react-icons/fa";
// import { FaSignOutAlt } from "react-icons/fa";




// export default function Header() {
//   return (
//     <>
//       <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
//         <div className="text-2xl font-bold">
//           Admin Panel
//         </div>

//         <nav className="flex space-x-6">
//           <a href="/dashboard" className="flex items-center hover:text-gray-300">
//             <FaTachometerAlt className="mr-2" /> Dashboard
//           </a>
//           <a href="/users" className="flex items-center hover:text-gray-300">
//             <FaUserSecret className="mr-2" /> Users
//           </a>
//           <a href="/settings" className="flex items-center hover:text-gray-300">
//             <FaCog className="mr-2" /> Settings
//           </a>
//         </nav>

//         <div className="flex items-center space-x-4">
//           <span className="hidden sm:inline">Welcome, Admin</span>
//           <a
//             href="/logout"
//             className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
//           >
//             <FaSignOutAlt className="mr-2" /> Logout
//           </a>
//         </div>
//       </header>

//     </>
//   )
// }



import React from 'react';
import { FaTachometerAlt, FaUserSecret, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow">
      {/* Logo / Title */}
      <div className="text-xl font-semibold">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap gap-4 items-center text-sm md:text-base">
        <Link to="/admin" className="flex items-center hover:text-gray-300 transition-colors">
          <FaTachometerAlt className="mr-2" /> Dashboard
        </Link>
        <Link to="/users" className="flex items-center hover:text-gray-300 transition-colors">
          <FaUserSecret className="mr-2" /> Users
        </Link>
        <Link to="/settings" className="flex items-center hover:text-gray-300 transition-colors">
          <FaCog className="mr-2" /> Settings
        </Link>
      </nav>

      {/* User Info */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-sm">Welcome, Admin</span>
        <Link
          to="/logout"
          className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </Link>
      </div>
    </header>
  );
}
