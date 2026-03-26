const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Generic fetch function
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// News APIs
export const newsAPI = {
  // Get all news with pagination and filters
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`news?${queryString}`);
  },
  
  // Get single news by ID
  getById: (id) => fetchAPI(`news/${id}`),
  
  // Get news by category
  getByCategory: (categorySlug, params = {}) => {
    const queryString = new URLSearchParams({ ...params, category: categorySlug }).toString();
    return fetchAPI(`news?${queryString}`);
  },
  
  // Search news
  search: (query, params = {}) => {
    const queryString = new URLSearchParams({ ...params, search: query }).toString();
    return fetchAPI(`news?${queryString}`);
  },
  
  // Create news (admin)
  create: (data) => fetchAPI('news', { method: 'POST', body: data }),
  
  // Update news (admin)
  update: (id, data) => fetchAPI(`news/${id}`, { method: 'PUT', body: data }),
  
  // Delete news (admin)
  delete: (id) => fetchAPI(`news/${id}`, { method: 'DELETE' }),
};

// Category APIs
export const categoryAPI = {
  getAll: () => fetchAPI('categories'),
};

// Trending APIs
export const trendingAPI = {
  getAll: () => fetchAPI('trending'),
};

// Popular APIs
export const popularAPI = {
  getAll: () => fetchAPI('popular'),
};

// Featured API
export const featuredAPI = {
  get: () => fetchAPI('featured'),
};

// Breaking News API
export const breakingAPI = {
  getAll: () => fetchAPI('breaking'),
};

// Admin APIs
export const adminAPI = {
  login: (email, password) => fetchAPI('admin/login', {
    method: 'POST',
    body: { email, password },
  }),
  
  setup: (data) => fetchAPI('admin/setup', {
    method: 'POST',
    body: data,
  }),
};

// Upload API
export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    
    return data;
  },
};
