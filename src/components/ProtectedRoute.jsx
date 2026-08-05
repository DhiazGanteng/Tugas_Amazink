import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const ProtectedRoute = ({ roles }) => {
  const location = useLocation();
  const user = authService.getStoredUser();

  if (!authService.isAuthenticated()) return <Navigate to="/" replace state={{ from: location }} />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
