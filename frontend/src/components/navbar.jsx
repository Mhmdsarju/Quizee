import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaRegUser, FaBell } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutApi } from "../api/authApi";
import logo from "../assets/logo1.png";
import Swal from "sweetalert2";
import { quizGuard } from "../pages/QuizGuard";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const handleNavClick = async (path) => {
  if (quizGuard.ongoing) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Quiz ongoing",
      text: "If you leave this page, your quiz will be cancelled. Do you want to continue?",
      showCancelButton: true,
      confirmButtonText: "Yes, Leave",
      cancelButtonText: "Stay",
    });

    if (!result.isConfirmed) {
      setOpenMenu(false);
      return; 
    }

    quizGuard.ongoing = false; 
  }

  if (!accessToken) navigate("/login");
  else navigate(path);

  setOpenMenu(false);
};


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

  const activeClass =
    "opacity-100 font-semibold border-b border-white pb-0.5";
  const normalClass = "opacity-60 hover:opacity-100 transition";

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      <nav className="relative bg-blue-quiz px-5 py-2.5 text-quiz-main shadow-xl md:rounded-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("/")}>
            <img src={logo} alt="Quizee" className="h-7 w-7" />
            <span className="text-sm font-semibold">Quizee.</span>
          </div>
          <ul className="hidden md:flex items-center gap-10 text-xs font-medium uppercase">
            <li>
              <button onClick={() => handleNavClick("/")}className={isActive("/") ? activeClass : normalClass}>
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("/user/quiz")}className={isActive("/user/quiz") ? activeClass : normalClass}>
                Quiz
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick("/user/contest")}className={isActive("/user/contest") ? activeClass : normalClass}>
                Contest
              </button>
            </li>
          </ul>
          <div className="hidden md:flex items-center gap-4">
            <span className="opacity-40 text-sm">|</span>

            {!accessToken ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="rounded-full bg-quiz-main px-4 py-1 text-blue-quiz font-semibold" >
                  Signup
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/user/notifications")}>
                  <FaBell className="h-4 w-5" />
                </button>
                <button onClick={() => navigate("/user/profile")}>
                  <FaRegUser className="h-4 w-6" />
                </button>

              </div>
            )}
          </div>
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setOpenMenu(!openMenu)}>
              {openMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        {openMenu && (
          <div className="mt-4 md:hidden bg-blue-quiz px-5 py-4 shadow-lg">
            <ul className="flex flex-col gap-4 text-sm uppercase">
              <button onClick={() => handleNavClick("/")} className={isActive("/") ? activeClass : normalClass}>
                Home
              </button>
              <button onClick={() => handleNavClick("/user/quiz")}className={ isActive("/user/quiz") ? activeClass : normalClass}>
                Quiz
              </button>
              <button onClick={() => handleNavClick("/user/contest")} className={ isActive("/user/contest") ? activeClass : normalClass }>
                Contest
              </button>
            </ul>

            {accessToken && (
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => navigate("/user/profile")} className="border py-1 rounded-full">
                  Profile
                </button>
                <button onClick={handleLogout} className="bg-red-900 text-red-400 py-1 rounded-full">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
