import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo1.png"

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition 
     ${isActive ? "bg-red-50/40 text-quiz-admin" : "text-gray-400 hover:text-quiz-admin"}`;

  return (
    <aside className="w-64 h-screen bg-blue-quiz flex flex-col justify-between">
  
      <div>
       <div className="flex px-9 py-3 items-center border-b border-gray-700">
                   <img src={logo} alt="Quizee" className="h-7 w-7" />
                   <span className="text-sm font-semibold text-quiz-main">Quizee.</span>
        </div>
        <nav className="mt-4 space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            Users
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/quizzes" className={linkClass}>
            Quizzes
          </NavLink>
          <NavLink to="/admin/contests" className={linkClass}>
            Contests
          </NavLink>
          <NavLink to="/admin/transactions" className={linkClass}>
            Transactions
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-gray-700 p-4">
        <p className="text-gray-400 text-sm mb-2">Admin</p>
        <button
          className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-md"
          onClick={() => {
            console.log("Logout");
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
