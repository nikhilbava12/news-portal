import { 
  newsAPI, 
  categoryAPI, 
  trendingAPI, 
  popularAPI, 
  featuredAPI, 
  breakingAPI 
} from '../services/api.js';

// Helper to strip HTML tags from content
const stripHTML = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

const slugify = (text) => (text || '')
  .toString()
  .trim()
  .toLowerCase()
  .replace(/\//g, '-')
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

// Helper to format API news to match frontend structure
const formatNews = (news) => ({
  id: news.news_id.toString(),
  title: news.title,
  description: news.excerpt || stripHTML(news.main_content?.substring(0, 150) + '...'),
  content: news.main_content,
  category: news.category_slug || slugify(news.category_name),
  categoryName: news.category_name || '',
  author: 'Admin',
  authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  publishedDate: news.published_at || news.created_at,
  imageUrl: news.featured_image || news.images?.[0]?.visual_url || news.images?.[0] || null,
  images: news.images || [],
  isTrending: news.is_trending,
  isBreaking: news.is_breaking,
  isPopular: news.is_popular,
  isFeatured: news.is_featured,
  views: news.total_views,
  trending_score: news.trending_score,
});

// Get all categories
export const getCategories = async () => {
  try {
    const data = await categoryAPI.getAll();
    return data.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get all news
export const getAllNews = async (page = 1, limit = 10) => {
  try {
    const data = await newsAPI.getAll({ page, limit });
    return {
      ...data,
      data: data.data.map(formatNews),
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return { data: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } };
  }
};

// Get single news by ID
export const getNewsById = async (id) => {
  try {
    const data = await newsAPI.getById(id);
    return formatNews(data);
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }
};

// Get news by category
export const getNewsByCategory = async (categorySlug, page = 1, limit = 10) => {
  try {
    const data = await newsAPI.getByCategory(categorySlug, { page, limit });
    return {
      ...data,
      data: data.data.map(formatNews),
    };
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return { data: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } };
  }
};

// Get trending news
export const getTrendingNews = async (limit = 5) => {
  try {
    const data = await trendingAPI.getAll();
    return data.slice(0, limit).map(formatNews);
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

// Get popular news
export const getPopularNews = async (limit = 5) => {
  try {
    const data = await popularAPI.getAll();
    return data.slice(0, limit).map(formatNews);
  } catch (error) {
    console.error('Error fetching popular news:', error);
    return [];
  }
};

// Get breaking news
export const getBreakingNews = async () => {
  try {
    const data = await breakingAPI.getAll();
    return data.map(formatNews);
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return [];
  }
};

// Get featured news
export const getFeaturedNews = async () => {
  try {
    const data = await featuredAPI.get();
    return data ? formatNews(data) : null;
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return null;
  }
};

// Get latest news
export const getLatestNews = async (limit = 10) => {
  try {
    const data = await newsAPI.getAll({ page: 1, limit });
    return data.data.map(formatNews);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

// Search news
export const searchNews = async (query) => {
  try {
    const data = await newsAPI.search(query, { page: 1, limit: 20 });
    return data.data.map(formatNews);
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

// Get related news (same category, excluding current)
export const getRelatedNews = async (currentId, categorySlug, limit = 3) => {
  try {
    const data = await newsAPI.getByCategory(categorySlug, { page: 1, limit: limit + 1 });
    return data.data
      .filter(news => news.news_id.toString() !== currentId)
      .slice(0, limit)
      .map(formatNews);
  } catch (error) {
    console.error('Error fetching related news:', error);
    return [];
  }
};

// Export categories for immediate use (will be fetched async)
export const categories = [
  { id: 'politics', name: 'Politics', slug: 'politics' },
  { id: 'technology', name: 'Technology', slug: 'technology' },
  { id: 'sports', name: 'Sports', slug: 'sports' },
  { id: 'business', name: 'Business', slug: 'business' },
  { id: 'health', name: 'Health', slug: 'health' },
  { id: 'entertainment', name: 'Entertainment', slug: 'entertainment' },
];

// Legacy export for compatibility
export const newsData = [];
