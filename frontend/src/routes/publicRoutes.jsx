import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth);
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
