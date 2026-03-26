import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiGrid, FiList } from 'react-icons/fi';
import { getNewsByCategory, getCategories } from '../../data/dummyNews';
import NewsCard from '../../components/NewsCard/NewsCard';

const CategoryPage = () => {
  const { name } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [categoryNews, setCategoryNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({ name: 'All News' });
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
    fetchCategoryData();
  }, [name]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const cats = await getCategories();
      setCategories(cats);
      
      // Find current category info
      const info = cats.find(cat => cat.slug === name) || { name: name === 'all' ? 'All News' : name };
      setCategoryInfo(info);
      
      // Fetch news
      const result = await getNewsByCategory(name === 'all' ? null : name, 1, 100);
      const news = result.data || [];
      setCategoryNews(news);
      setTotalPages(Math.ceil(news.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedNews = categoryNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-news-red transition-colors duration-200">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-news-dark font-medium">{categoryInfo.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-news-dark mb-2">
                {categoryInfo.name}
              </h1>
              <p className="text-gray-600">
                {categoryNews.length} articles found
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-news-red text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-news-red text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Categories Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <Link
              to="/category/all"
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                name === 'all'
                  ? 'bg-news-red text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All News
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  name === category.slug
                    ? 'bg-news-red text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* News Grid/List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-red"></div>
          </div>
        ) : categoryNews.length > 0 ? (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {paginatedNews.map((news, index) => (
                <NewsCard 
                  key={news.id} 
                  news={news} 
                  variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  index={index} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-news-red text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
            <Link 
              to="/" 
              className="mt-4 inline-block px-6 py-2 bg-news-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Browse All News
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
