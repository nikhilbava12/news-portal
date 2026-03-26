import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiTrendingUp, FiEye } from 'react-icons/fi';
import NewsCard from '../NewsCard/NewsCard';
import { getTrendingNews, getPopularNews, getCategories } from '../../data/dummyNews';

const Sidebar = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [trendingNews, setTrendingNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      const [trending, popular, cats] = await Promise.all([
        getTrendingNews(5),
        getPopularNews(4),
        getCategories()
      ]);
      setTrendingNews(trending);
      setPopularNews(popular);
      setCategories(cats);
    };
    fetchSidebarData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <aside className="space-y-8">
      {/* Trending News */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FiTrendingUp className="text-news-red" size={20} />
          <h3 className="text-lg font-bold text-news-dark">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingNews.map((news, index) => (
            <div key={news.id} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-8 h-8 bg-news-red text-white rounded-lg flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <NewsCard news={news} variant="compact" index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FiEye className="text-news-red" size={20} />
          <h3 className="text-lg font-bold text-news-dark">Most Popular</h3>
        </div>
        <div className="space-y-4">
          {popularNews.map((news, index) => (
            <NewsCard key={news.id} news={news} variant="compact" index={index} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-news-dark mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="px-4 py-2 bg-gray-100 hover:bg-news-red hover:text-white text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-news-dark rounded-xl shadow-sm p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
        <p className="text-gray-400 text-sm mb-4">
          Subscribe to our newsletter for the latest news delivered to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-news-red placeholder-gray-500 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-news-red hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Subscribe</span>
            <FiSend size={16} />
          </button>
        </form>
        {subscribed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-sm mt-3"
          >
            Thank you for subscribing!
          </motion.p>
        )}
      </motion.div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-news-dark mb-4">Follow Us</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((platform) => (
            <a
              key={platform}
              href="#"
              className="flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-news-red hover:text-white text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
