import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiX } from 'react-icons/fi';
import { searchNews, getLatestNews } from '../../data/dummyNews';
import NewsCard from '../../components/NewsCard/NewsCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    if (!query.trim()) {
      const latest = await getLatestNews(9);
      setLatestNews(latest);
      return;
    }
    setLoading(true);
    const searchResults = await searchNews(query);
    setResults(searchResults);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-news-red mb-6 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-news-dark mb-6">
            Search Results
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for news articles..."
                className="w-full px-4 py-4 pl-12 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-news-red focus:border-transparent shadow-sm text-lg"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </form>

          {/* Results Count */}
          {query && (
            <p className="text-gray-600 mt-4">
              {results.length > 0 ? (
                <>
                  Found <span className="font-semibold text-news-dark">{results.length}</span> results for "<span className="font-semibold text-news-dark">{query}</span>"
                </>
              ) : loading ? (
                'Searching...'
              ) : (
                <>
                  No results found for "<span className="font-semibold text-news-dark">{query}</span>"
                </>
              )}
            </p>
          )}
        </motion.div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-red"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NewsCard news={news} index={index} />
              </motion.div>
            ))}
          </div>
        ) : query ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="text-gray-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-news-dark mb-2">No Results Found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your search. Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="px-6 py-2 bg-news-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Browse All News
              </Link>
              <Link
                to="/category/all"
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                View Categories
              </Link>
            </div>
          </motion.div>
        ) : null}

        {/* Browse All */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-news-dark mb-6">Browse All Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((news, index) => (
                <NewsCard key={news.id} news={news} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
