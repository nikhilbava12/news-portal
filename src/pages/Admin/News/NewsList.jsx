import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
} from 'react-icons/fi';
import { newsAPI, categoryAPI } from '../../../services/adminApi';
import { toast } from 'react-toastify';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [expandedRow, setExpandedRow] = useState(null);
  const statuses = ['All', 'Published', 'Draft'];
  const navigate = useNavigate();

  // Filter news
  const filteredNews = deleting ? news : news;

  useEffect(() => {
    fetchCategories();
    fetchNews();
  }, [pagination.page, categoryFilter, statusFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.success) {
        setCategories(['All', ...response.categories.map(c => c.name)]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getAll(
        pagination.page,
        pagination.limit,
        categoryFilter,
        statusFilter,
        searchQuery
      );
      if (response.success) {
        setNews(response.news);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews();
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await newsAPI.delete(id);
      toast.success('News deleted successfully');
      fetchNews(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete news');
    } finally {
      setDeleting(false);
      setDeleteModal({ show: false, id: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">News Management</p>
          </div>
          <p className="text-sm text-slate-500">Manage all news articles and track publication status</p>
        </div>
        <Link
          to="/admin/news/create"
          className="inline-flex items-center px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 font-medium shadow-lg shadow-emerald-200"
        >
          <FiPlus size={20} className="mr-2" />
          Add News
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-emerald-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer min-w-[150px] text-sm text-slate-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer min-w-[130px] text-sm text-slate-600"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 mt-2 text-sm">Loading news articles...</p>
                  </td>
                </tr>
              ) : (
                filteredNews.map((item, index) => (
                  <>
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full transition-transform ${expandedRow === item.id ? 'bg-emerald-500 rotate-90' : 'bg-slate-300'}`}></div>
                        <div className="font-medium text-slate-800 max-w-xs truncate">{item.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200" 
                          title="View news"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/news/view/${item.id}`);
                          }}
                        >
                          <FiEye size={18} />
                        </button>
                        <Link
                          to={`/admin/news/edit/${item.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit news"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ show: true, id: item.id });
                          }}
                          disabled={deleting}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete news"
                        >
                          {deleting ? (
                            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiTrash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  
                  {/* Expanded Details Row */}
                  {expandedRow === item.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan="7" className="px-6 py-4">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Title</h4>
                              <p className="text-slate-800 font-medium">{item.title}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category & Status</h4>
                              <div className="flex gap-2">
                                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm">{item.category}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Content Preview</h4>
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                              {item.content || item.main_content || 'No content available'}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <div className="flex gap-4 text-sm text-slate-500">
                              <span>Views: <strong className="text-slate-700">{item.views?.toLocaleString()}</strong></span>
                              <span>Created: <strong className="text-slate-700">{item.date || item.created_at}</strong></span>
                            </div>
                            <Link
                              to={`/admin/news/edit/${item.id}`}
                              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <FiEdit2 size={16} />
                              Edit This News
                            </Link>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No news found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Try adjusting your search query or filters to find what you're looking for.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{news.length}</span> of <span className="font-medium text-slate-700">{pagination.total}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-40"
            >
              <FiChevronLeft size={20} />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination({ ...pagination, page })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  page === pagination.page ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-40"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={28} className="text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">Delete News?</h3>
            <p className="text-slate-500 mb-8 text-center leading-relaxed">Are you sure you want to delete this news article? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-6 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
                disabled={deleting}
                className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                  deleting 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200'
                }`}
              >
                {deleting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewsList;
