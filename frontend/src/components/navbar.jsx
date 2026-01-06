import { Link, useNavigate, useLocation } from "react-router-dom";
import {FaSearch,FaBars,FaTimes,FaRegUser,FaBell,} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutApi } from "../api/authApi"; 
import logo from "../assets/logo1.png";

const Navbar = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const inputRef = useRef(null);

  const { accessToken, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (openSearch && inputRef.current) inputRef.current.focus();
  }, [openSearch]);

  const handleNavClick = (path) => {
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
      setOpenProfile(false);
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
     
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick("/")}>
            <img src={logo} alt="Quizee" className="h-7 w-7" />
            <span className="text-sm font-semibold">Quizee.</span>
          </div>

          <ul className="hidden md:flex items-center gap-10 text-xs font-medium uppercase">
            <li>
              <button
                onClick={() => handleNavClick("/")}
                className={isActive("/") ? activeClass : normalClass}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("/user/quiz")}
                className={
                  isActive("/user/quiz") ? activeClass : normalClass
                }
              >
                Quiz
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("/user/contest")}
                className={
                  isActive("/user/contest") ? activeClass : normalClass
                }
              >
                Contest
              </button>
            </li>
          </ul>

          <div className="hidden md:flex items-center gap-4 relative">
            {openSearch ? (
              <input
                ref={inputRef}
                type="text"
                placeholder="Search quizzes..."
                className="w-40 rounded-full px-3 py-1 text-xs text-black outline-none"
                onBlur={() => setOpenSearch(false)}
              />
            ) : (
              <button onClick={() => setOpenSearch(true)}>
                <FaSearch className="h-3.5 w-3.5" />
              </button>
            )}

            <span className="opacity-40 text-sm">|</span>

            {!accessToken ? (
              <>
                <Link to="/login">Login</Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-quiz-main px-4 py-1 text-blue-quiz font-semibold"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => navigate("/user/notifications")}
                  className="relative"
                >
                  <FaBell className="h-4 w-5" />
                </button>

                <button onClick={() => setOpenProfile(!openProfile)}>
                  <FaRegUser className="h-4 w-6" />
                </button>

                {openProfile && (
                  <div className="absolute right-0 top-10 w-40 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-2 text-sm font-semibold">
                      {user?.name}
                    </div>
                    <button
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setOpenSearch(!openSearch)}>
              <FaSearch />
            </button>
            <button onClick={() => setOpenMenu(!openMenu)}>
              {openMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        {openMenu && (
          <div className="mt-4 md:hidden bg-blue-quiz px-5 py-4 shadow-lg">
            <ul className="flex flex-col gap-4 text-sm uppercase">
              <button
                onClick={() => handleNavClick("/")}
                className={isActive("/") ? activeClass : normalClass}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("/user/quiz")}
                className={
                  isActive("/user/quiz") ? activeClass : normalClass
                }
              >
                Quiz
              </button>
              <button
                onClick={() => handleNavClick("/user/contest")}
                className={
                  isActive("/user/contest") ? activeClass : normalClass
                }
              >
                Contest
              </button>
            </ul>

            {!accessToken && (
              <div className="mt-4 flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 text-center border py-1 rounded-full"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center bg-quiz-main text-blue-quiz py-1 rounded-full"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
