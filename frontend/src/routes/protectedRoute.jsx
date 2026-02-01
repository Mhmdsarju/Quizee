import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children, role }) => {
  const { accessToken, user, loading, authChecked } =
    useSelector((state) => state.auth);

  if (!authChecked || loading) return <Loader />;

  if (!accessToken || !user) {
    return role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export default ProtectedRoute;
