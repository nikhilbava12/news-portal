import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiEye } from 'react-icons/fi';
import { getTrendingNews, getPopularNews } from '../../data/dummyNews';
import NewsCard from '../../components/NewsCard/NewsCard';
import Sidebar from '../../components/Sidebar/Sidebar';

const Trending = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      setLoading(true);
      const [trending, popular] = await Promise.all([
        getTrendingNews(10),
        getPopularNews(5)
      ]);
      setTrendingNews(trending);
      setPopularNews(popular);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-news-red/10 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-news-red" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-news-dark">
                Trending News
              </h1>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Stay updated with the most popular and talked-about stories. These articles 
            are generating the most engagement from our readers right now.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-red"></div>
              </div>
            ) : (
              <>
                {/* Top Trending */}
                <section>
                  <h2 className="text-2xl font-bold text-news-dark mb-6 border-l-4 border-news-red pl-4">
                    Top Trending
                  </h2>
                  {trendingNews.length > 0 ? (
                    <div className="space-y-6">
                      {trendingNews.map((news, index) => (
                        <motion.div
                          key={news.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start space-x-4 bg-white rounded-xl shadow-sm p-4"
                        >
                          <span className="flex-shrink-0 w-12 h-12 bg-news-red text-white rounded-lg flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <NewsCard news={news} variant="horizontal" index={index} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No trending news available.</p>
                  )}
                </section>

                {/* Most Popular */}
                <section>
                  <div className="flex items-center space-x-2 mb-6">
                    <FiEye className="text-news-red" size={24} />
                    <h2 className="text-2xl font-bold text-news-dark border-l-4 border-news-red pl-4">
                      Most Popular
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {popularNews.map((news, index) => (
                      <NewsCard key={news.id} news={news} index={index} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
