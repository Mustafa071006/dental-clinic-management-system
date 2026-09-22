import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * @param {string} allowedRole — 'ADMIN' atau 'DOCTOR'
 */
const RoleRoute = ({ allowedRole }) => {
  const { user } = useAuth();

  if (user?.role !== allowedRole) {
    // Redirect ke dashboard yang sesuai role
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'DOCTOR') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;