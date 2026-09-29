import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on their role if they try to access unauthorized route
    if(user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if(user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    if(user.role === 'INTERVIEWER') return <Navigate to="/interviewer/dashboard" replace />;
    return <Navigate to="/candidate/dashboard" replace />;
  }

  return <Outlet />;
};
