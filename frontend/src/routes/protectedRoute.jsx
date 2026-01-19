import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children, role }) => {
  const {
    accessToken,
    user,
    loading,
    authChecked,
  } = useSelector((state) => state.auth);

  const location = useLocation();

  // 🔥 WAIT until refreshToken API finishes
  if (!authChecked || loading) {
    return <Loader />;
  }

  // 🔐 Not authenticated
  if (!accessToken || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 🛑 Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 🧭 Extra safety redirects
  if (user.role === "admin" && location.pathname.startsWith("/user")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "user" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
