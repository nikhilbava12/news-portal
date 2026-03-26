import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

const NewsCard = ({ news, variant = 'default', index = 0 }) => {
  // Handle null/undefined news
  if (!news) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      politics: 'bg-blue-500',
      technology: 'bg-purple-500',
      sports: 'bg-green-500',
      business: 'bg-amber-500',
      health: 'bg-teal-500',
      entertainment: 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  // Featured variant (hero section)
  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg"
      >
        <Link to={`/news/${news.id}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-full overflow-hidden">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
              <span className={`absolute top-4 left-4 ${getCategoryColor(news.category)} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`}>
                {news.categoryName}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <FiCalendar className="mr-2" size={14} />
                {formatDate(news.publishedDate)}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-news-dark mb-4 leading-tight group-hover:text-news-red transition-colors duration-200">
                {news.title}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-3">
                {news.description}
              </p>
              <div className="flex items-center text-news-red font-semibold text-sm">
                Read More
                <FiArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Compact variant (sidebar, trending)
  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group"
      >
        <Link to={`/news/${news.id}`} className="flex items-start space-x-4">
          <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`inline-block ${getCategoryColor(news.category)} text-white px-2 py-0.5 rounded text-xs font-medium mb-1`}>
              {news.categoryName}
            </span>
            <h4 className="text-sm font-semibold text-news-dark leading-snug group-hover:text-news-red transition-colors duration-200 line-clamp-2">
              {news.title}
            </h4>
            <p className="text-gray-400 text-xs mt-1">
              {formatDate(news.publishedDate)}
            </p>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Horizontal variant (list view)
  if (variant === 'horizontal') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <Link to={`/news/${news.id}`} className="flex flex-col sm:flex-row">
          <div className="relative sm:w-48 h-48 sm:h-32 flex-shrink-0 overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className={`absolute top-3 left-3 ${getCategoryColor(news.category)} text-white px-2 py-0.5 rounded text-xs font-medium`}>
              {news.categoryName}
            </span>
          </div>
          <div className="flex-1 p-4">
            <h3 className="text-lg font-bold text-news-dark mb-2 group-hover:text-news-red transition-colors duration-200 line-clamp-2">
              {news.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {news.description}
            </p>
            <div className="flex items-center text-gray-400 text-xs">
              <FiCalendar className="mr-1" size={12} />
              {formatDate(news.publishedDate)}
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Default card variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/news/${news.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className={`absolute top-3 left-3 ${getCategoryColor(news.category)} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`}>
            {news.categoryName}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center text-gray-400 text-xs mb-2">
            <FiCalendar className="mr-1" size={12} />
            {formatDate(news.publishedDate)}
          </div>
          <h3 className="text-lg font-bold text-news-dark mb-2 leading-snug group-hover:text-news-red transition-colors duration-200 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {news.description}
          </p>
          <div className="flex items-center text-news-red font-semibold text-sm">
            Read More
            <FiArrowRight className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;
