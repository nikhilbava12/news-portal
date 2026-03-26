import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiFileText,
  FiTag,
  FiBook,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiLayers,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: FiGrid },
  { name: 'News', path: '/admin/news', icon: FiFileText },
  { name: 'Categories', path: '/admin/categories', icon: FiLayers },
  { name: 'Tags', path: '/admin/tags', icon: FiTag },
  { name: 'Pages', path: '/admin/pages', icon: FiBook },
  { name: 'Messages', path: '/admin/messages', icon: FiMessageSquare },
  { name: 'Settings', path: '/admin/settings', icon: FiSettings },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transition-transform duration-300 ease-in-out h-screen overflow-y-auto flex flex-col ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white">NEWS</span>
              <span className="text-xs text-emerald-400 ml-1">Admin</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center">
                  <Icon size={18} className="mr-3" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <FiChevronRight 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <FiLogOut size={18} className="mr-3" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
