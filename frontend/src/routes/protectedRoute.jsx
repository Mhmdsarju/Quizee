import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children, role }) => {
  const { accessToken, user, loading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  if (loading) return <Loader />;
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user.role === "user" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
