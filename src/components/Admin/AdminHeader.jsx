import { FiMenu, FiBell, FiUser, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = ({ onMenuClick, title = 'Dashboard', subtitle = 'Here is your analytics dashboard' }) => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-4 lg:px-8">
        {/* Left - Menu Button & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
          >
            <FiMenu size={24} />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white rounded-lg border border-emerald-200 px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <FiSearch size={18} className="text-emerald-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-slate-600 w-48"
            />
          </div>
        </div>

        {/* Right - Notifications & User Info */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-emerald-200">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <FiUser size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin'}</p>
              <p className="text-xs text-emerald-600 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="px-4 lg:px-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">WELCOME!</p>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default AdminHeader;
