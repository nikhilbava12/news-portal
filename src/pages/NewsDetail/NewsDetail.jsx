import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft, FiFacebook, FiTwitter, FiLinkedin, FiShare2 } from 'react-icons/fi';
import { getNewsById, getRelatedNews } from '../../data/dummyNews';
import NewsCard from '../../components/NewsCard/NewsCard';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNewsData();
  }, [id]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const newsData = await getNewsById(id);
      setNews(newsData);
      
      if (newsData) {
        const related = await getRelatedNews(id, newsData.category, 3);
        setRelatedNews(related);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-red"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-news-dark mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The news article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-news-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform) => {
    const text = encodeURIComponent(news.title);
    const url = encodeURIComponent(shareUrl);
    
    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-news-red mb-6 transition-colors duration-200"
        >
          <FiArrowLeft className="mr-2" />
          Back to News
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Featured Image */}
              <div className="relative h-64 md:h-96">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-news-red text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  {news.categoryName}
                </span>
              </div>

              {/* Article Content */}
              <div className="p-6 md:p-10">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-news-dark mb-6 leading-tight">
                  {news.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b">
                  <div className="flex items-center">
                    <img
                      src={news.authorAvatar}
                      alt={news.author}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-semibold text-news-dark">{news.author}</p>
                      <p className="text-gray-500 text-sm">Author</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiCalendar className="mr-2" />
                    {formatDate(news.publishedDate)}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center space-x-3 mb-8">
                  <span className="text-gray-600 font-medium flex items-center">
                    <FiShare2 className="mr-2" />
                    Share:
                  </span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                    aria-label="Share on Facebook"
                  >
                    <FiFacebook size={18} />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors duration-200"
                    aria-label="Share on Twitter"
                  >
                    <FiTwitter size={18} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors duration-200"
                    aria-label="Share on LinkedIn"
                  >
                    <FiLinkedin size={18} />
                  </button>
                </div>

                {/* Article Body */}
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>
            </motion.div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-news-dark mb-6 border-l-4 border-news-red pl-4">
                  Related News
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedNews.map((related, index) => (
                    <NewsCard key={related.id} news={related} index={index} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Box */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-news-dark mb-4">About the Author</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={news.authorAvatar}
                    alt={news.author}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-bold text-news-dark">{news.author}</p>
                    <p className="text-gray-500 text-sm">Staff Writer</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Experienced journalist covering {news.categoryName.toLowerCase()} news with in-depth analysis and breaking coverage.
                </p>
              </div>

              {/* Category Tag */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-news-dark mb-4">Category</h3>
                <Link
                  to={`/category/${news.category}`}
                  className="inline-block px-4 py-2 bg-news-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  {news.categoryName}
                </Link>
              </div>

              {/* More from Category */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-news-dark mb-4">
                  More in {news.categoryName}
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((item, index) => (
                    <NewsCard key={item.id} news={item} variant="compact" index={index} />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
