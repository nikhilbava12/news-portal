import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiLayers,
  FiEye,
  FiMessageSquare,
  FiTrendingUp,
  FiClock
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/adminApi';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
        <Icon size={28} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <FiTrendingUp size={14} />
          <span className="text-xs font-medium">{trend}</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalNews: 0,
    totalCategories: 0,
    totalViews: 0,
    newMessages: 0
  });
  const [latestNews, setLatestNews] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      if (response.success) {
        setStats(response.stats);
        setLatestNews(response.latestNews || []);
        setRecentMessages(response.recentMessages || []);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total News Articles"
          value={stats.totalNews}
          icon={FiFileText}
          color="bg-gradient-to-br from-emerald-400 to-emerald-600"
          trend="+12%"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={FiLayers}
          color="bg-gradient-to-br from-blue-400 to-blue-600"
          trend="+5%"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={FiEye}
          color="bg-gradient-to-br from-violet-400 to-violet-600"
          trend="+24%"
        />
        <StatCard
          title="New Messages"
          value={stats.newMessages}
          icon={FiMessageSquare}
          color="bg-gradient-to-br from-amber-400 to-amber-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Latest News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-800">Latest News</h2>
            </div>
            <Link to="/admin/news" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {latestNews.map((news) => (
              <div key={news.id} className="p-4 hover:bg-emerald-50/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800 truncate">{news.title}</h3>
                    <div className="flex items-center mt-2 gap-3 text-sm text-slate-500">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium">{news.category}</span>
                      <span className="flex items-center text-slate-400">
                        <FiClock size={14} className="mr-1" />
                        {news.date}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    news.status === 'published'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {news.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <h2 className="text-lg font-bold text-slate-800">Recent Messages</h2>
            </div>
            <Link to="/admin/messages" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-800">{msg.name}</h3>
                      {msg.status === 'new' && (
                        <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{msg.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{msg.date}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
