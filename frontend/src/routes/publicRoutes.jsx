import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const PublicRoute = ({ children }) => {
  const { accessToken, user, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) return <Loader />;

  if (accessToken && user) {
    return user.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
