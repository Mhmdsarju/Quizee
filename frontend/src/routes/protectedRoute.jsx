import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children, role }) => {
  const { accessToken, user, loading, authChecked } =
    useSelector((state) => state.auth);
  const location = useLocation();

  // ⏳ wait until refresh attempt finishes
  if (!authChecked) return <Loader />;

  // 🔒 not logged in
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 role mismatch
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 🚫 admin → user routes
  if (user?.role === "admin" && location.pathname.startsWith("/user")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 🚫 user → admin routes
  if (user?.role === "user" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export default ProtectedRoute;
