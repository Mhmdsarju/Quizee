import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutApi } from "../api/authApi";
import { FaUser, FaWallet, FaCog, FaHistory, FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
     ${
       isActive
         ? "bg-white/15 text-white shadow-lg shadow-black/10"
         : "text-blue-100 hover:bg-white/10 hover:text-white"
     }`;

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { to: "/user/profile", label: "My Profile", icon: <FaUser /> },
    { to: "/user/wallet", label: "My Wallet", icon: <FaWallet /> },
    { to: "/user/settings", label: "Settings", icon: <FaCog /> },
    { to: "/user/history", label: "History", icon: <FaHistory /> },
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-blue-quiz text-white rounded-full shadow-lg border border-white/20 active:scale-90 transition-transform"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-blue-quiz text-white p-6 flex flex-col transition-transform duration-300 ease-in-out border-r border-white/10
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors mb-8"
          >
            <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setIsOpen(false)} 
            >
              <span className="text-lg opacity-80">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-100 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all font-bold group"
          >
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}