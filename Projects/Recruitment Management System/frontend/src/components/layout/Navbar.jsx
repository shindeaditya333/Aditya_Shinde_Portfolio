import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'RECRUITER') return '/recruiter/dashboard';
    if (user.role === 'INTERVIEWER') return '/interviewer/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center gap-2 text-indigo-600">
              <Briefcase className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">RecruitFlow</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">
              Browse Jobs
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-indigo-600 font-medium">
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 font-medium px-3 py-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
