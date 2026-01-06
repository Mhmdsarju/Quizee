import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children, role }) => {
  const { accessToken, user, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return <Loader />;
  }
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return user.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
