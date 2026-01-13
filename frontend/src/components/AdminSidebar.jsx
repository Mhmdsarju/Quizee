import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../assets/logo1.png";
import { logoutApi } from "../api/authApi";
import { logout } from "../redux/authSlice";
import { FaBars } from "react-icons/fa";

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition 
     ${
       isActive
         ? "bg-red-50/40 text-quiz-admin"
         : "text-gray-400 hover:text-quiz-admin"
     }`;

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-blue-quiz"
        onClick={() => setOpen(true)}
      >
        <FaBars size={20} />
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed md:static z-50 top-0 left-0 w-64 bg-blue-quiz min-h-screen flex flex-col transform transition-transform duration-300
        overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div>
          <div className="flex px-9 py-3 items-center border-b border-gray-700">
            <img src={logo} alt="Quizee" className="h-7 w-7" />
            <span className="text-sm font-semibold text-quiz-main ml-2">
              Quizee.
            </span>
          </div>

          <nav className="mt-4 space-y-1">
            <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/users" className={linkClass} onClick={() => setOpen(false)}>
              Users
            </NavLink>
            <NavLink to="/admin/categories" className={linkClass} onClick={() => setOpen(false)}>
              Categories
            </NavLink>
            <NavLink to="/admin/quizzes" className={linkClass} onClick={() => setOpen(false)}>
              Quizzes
            </NavLink>
            <NavLink to="/admin/contests" className={linkClass} onClick={() => setOpen(false)}>
              Contests
            </NavLink>
            <NavLink to="/admin/transactions" className={linkClass} onClick={() => setOpen(false)}>
              Transactions
            </NavLink>
          </nav>
        </div>

        <div className="border-t border-gray-700 p-4 bg-black space-y-3 mt-auto">
          <div className="flex items-center space-x-2">
            <h3 className="text-white bg-gray-600 inline p-2 rounded-full">
              AD
            </h3>
            <p className="text-gray-400 text-sm">Admin</p>
          </div>

          <button className="w-full px-3 py-2 text-red-600 bg-red-900 hover:bg-gray-800 rounded-md" onClick={handleLogout} >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
