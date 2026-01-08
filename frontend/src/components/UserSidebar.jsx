import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutApi } from "../api/authApi";
import { FaArrowLeft } from "react-icons/fa";

export default function UserSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm transition
     ${
       isActive
         ? "bg-[#2f3b32] text-white"
         : "text-gray-300 hover:bg-[#2f3b32]"
     }`;

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-blue-quiz text-white p-6 flex flex-col">

      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6">
        <FaArrowLeft size={12} />
        <span>Back to Home</span>
      </button>

      <nav className="space-y-2">
        <NavLink to="/user/profile" className={linkClass}>
          My Profile
        </NavLink>
        <NavLink to="/user/wallet" className={linkClass}>
          My Wallet
        </NavLink>
        <NavLink to="/user/settings" className={linkClass}>
          Settings
        </NavLink>
        <NavLink to="/user/history" className={linkClass}>
          History
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="mt-auto px-3 py-2 text-red-600 bg-red-900 hover:bg-gray-800 rounded-md">
        Logout
      </button>

    </aside>
  );
}
