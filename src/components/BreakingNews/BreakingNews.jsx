import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getBreakingNews } from '../../data/dummyNews';

const BreakingNews = () => {
  const [breakingNews, setBreakingNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      const news = await getBreakingNews();
      setBreakingNews(news);
    };
    fetchBreakingNews();
  }, []);

  useEffect(() => {
    if (breakingNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 1 >= breakingNews.length ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews]);

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-news-red text-white py-2.5 overflow-hidden">
      <div className="container">
        <div className="flex items-center">
          {/* Breaking Label */}
          <div className="flex items-center space-x-2 bg-white/20 px-4 py-1 rounded-full mr-4 flex-shrink-0">
            <FiTrendingUp size={16} className="animate-pulse" />
            <span className="font-bold text-sm uppercase tracking-wider">Breaking</span>
          </div>

          {/* News Ticker */}
          <div ref={containerRef} className="flex-1 overflow-hidden relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Link 
                to={`/news/${breakingNews[currentIndex]?.id}`}
                className="text-sm md:text-base font-medium hover:underline truncate"
              >
                {breakingNews[currentIndex]?.title}
              </Link>
              <span className="ml-4 text-white/70 text-xs hidden md:inline">
                {new Date(breakingNews[currentIndex]?.publishedDate).toLocaleDateString()}
              </span>
            </motion.div>
          </div>

          {/* News Counter */}
          <div className="hidden sm:flex items-center space-x-2 ml-4 flex-shrink-0">
            <span className="text-xs text-white/80">
              {currentIndex + 1} / {breakingNews.length}
            </span>
            <div className="flex space-x-1">
              {breakingNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                  }`}
                  aria-label={`Go to news item ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
