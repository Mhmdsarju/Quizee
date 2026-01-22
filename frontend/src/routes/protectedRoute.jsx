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

  if (!authChecked || loading) {
    return <Loader />;
  }

  if (!accessToken || !user) {
  return <Navigate to="/admin" replace />;
}

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;
