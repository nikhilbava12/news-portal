import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';
import NewsDetail from '../pages/NewsDetail/NewsDetail';
import CategoryPage from '../pages/CategoryPage/CategoryPage';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import SearchResults from '../pages/SearchResults/SearchResults';
import Trending from '../pages/Trending/Trending';

// Admin imports
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/Admin/ProtectedRoute';
import AdminLayout from '../components/Admin/AdminLayout';
import Login from '../pages/Admin/Login';
import Dashboard from '../pages/Admin/Dashboard';
import NewsList from '../pages/Admin/News/NewsList';
import AddEditNews from '../pages/Admin/News/AddEditNews';
import ViewNews from '../pages/Admin/News/ViewNews';
import Categories from '../pages/Admin/Categories';
import Tags from '../pages/Admin/Tags';
import Pages from '../pages/Admin/Pages';
import Messages from '../pages/Admin/Messages';
import Settings from '../pages/Admin/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/news/:id',
        element: <NewsDetail />,
      },
      {
        path: '/category/:name',
        element: <CategoryPage />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/search',
        element: <SearchResults />,
      },
      {
        path: '/trending',
        element: <Trending />,
      },
      {
        path: '/categories',
        element: <Navigate to="/category/all" replace />,
      },
      {
        path: '*',
        element: (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-news-red mb-4">404</h1>
              <h2 className="text-2xl font-bold text-news-dark mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-news-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Go Home
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: '/admin',
        element: <Dashboard />,
      },
      {
        path: '/admin/news',
        element: <NewsList />,
      },
      {
        path: '/admin/news/create',
        element: <AddEditNews />,
      },
      {
        path: '/admin/news/edit/:id',
        element: <AddEditNews />,
      },
      {
        path: '/admin/news/view/:id',
        element: <ViewNews />,
      },
      {
        path: '/admin/categories',
        element: <Categories />,
      },
      {
        path: '/admin/tags',
        element: <Tags />,
      },
      {
        path: '/admin/pages',
        element: <Pages />,
      },
      {
        path: '/admin/messages',
        element: <Messages />,
      },
      {
        path: '/admin/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
]);

export default router;
