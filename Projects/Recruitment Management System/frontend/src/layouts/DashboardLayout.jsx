import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, LayoutDashboard, User, FileText, 
  Search, Users, Calendar, Settings, LogOut, FileUp
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    switch(user?.role) {
      case 'CANDIDATE':
        return [
          { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
          { name: 'My Profile', path: '/candidate/profile', icon: User },
          { name: 'My Resume', path: '/candidate/resume', icon: FileUp },
          { name: 'Browse Jobs', path: '/jobs', icon: Search },
          { name: 'Applications', path: '/candidate/applications', icon: FileText },
          { name: 'Offers', path: '/candidate/offers', icon: FileText },
        ];
      case 'RECRUITER':
        return [
          { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
          { name: 'Jobs', path: '/recruiter/jobs', icon: Briefcase },
          { name: 'Applications', path: '/recruiter/applications', icon: FileText },
          { name: 'Candidates', path: '/recruiter/candidates', icon: Users },
          { name: 'Interviews', path: '/recruiter/interviews', icon: Calendar },
          { name: 'AI Assistant', path: '/recruiter/assistant', icon: Search },
        ];
      case 'INTERVIEWER':
        return [
          { name: 'Dashboard', path: '/interviewer/dashboard', icon: LayoutDashboard },
          { name: 'Interviews', path: '/interviewer/interviews', icon: Calendar },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Jobs', path: '/recruiter/jobs', icon: Briefcase },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-indigo-400">
            <Briefcase className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight text-white">RecruitFlow</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-gray-800 capitalize">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
