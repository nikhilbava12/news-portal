import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NewsCard from '../../components/NewsCard/NewsCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import BreakingNews from '../../components/BreakingNews/BreakingNews';
import { getFeaturedNews, getLatestNews, getCategories, getNewsByCategory } from '../../data/dummyNews';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredNews, setFeaturedNews] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [featured, latest, cats] = await Promise.all([
        getFeaturedNews(),
        getLatestNews(6),
        getCategories()
      ]);
      
      setFeaturedNews(featured);
      setLatestNews(latest);
      setCategories(cats);
      
      // Fetch news for each category
      const catNews = {};
      for (const cat of cats) {
        const news = await getNewsByCategory(cat.slug, 1, 4);
        catNews[cat.slug] = news.data || [];
      }
      setCategoryNews(catNews);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Breaking News Ticker */}
      <div className="fixed top-0 left-0 right-0 z-40 mt-16">
        <BreakingNews />
      </div>

      {/* Main Content */}
      <main className="container py-8 mt-20">
        {/* Hero Section */}
        <section className="mb-12 pt-4 mt-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NewsCard news={featuredNews} variant="featured" />
          </motion.div>
        </section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Latest News Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-news-dark border-l-4 border-news-red pl-4">
                  Latest News
                </h2>
                <Link 
                  to="/category/all" 
                  className="text-news-red hover:text-red-700 font-medium text-sm flex items-center"
                >
                  View All
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {latestNews.map((news, index) => (
                  <NewsCard key={news.id} news={news} index={index} />
                ))}
              </div>
            </section>

            {/* Category Sections */}
            {categories.map((category) => {
              const catNews = categoryNews[category.slug] || [];
              if (catNews.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-news-dark border-l-4 border-news-red pl-4">
                      {category.name}
                    </h2>
                    <Link 
                      to={`/category/${category.slug}`}
                      className="text-news-red hover:text-red-700 font-medium text-sm flex items-center"
                    >
                      View All
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {catNews.map((news, index) => (
                      <NewsCard key={news.id} news={news} index={index} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
