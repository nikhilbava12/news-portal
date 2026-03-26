import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { newsAPI } from '../../../services/adminApi';

const ViewNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await newsAPI.getById(id);
        if (response?.success && response?.news) {
          setNews(response.news);
        } else {
          toast.error(response?.error || 'Failed to load news');
        }
      } catch (e) {
        toast.error(e?.response?.data?.error || e?.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-slate-600">Loading news...</span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/news')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
        >
          <FiArrowLeft />
          Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
          <div className="text-slate-700 font-semibold">News not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/news"
            className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-200 hover:border-emerald-200"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">View News</p>
            </div>
            <p className="text-sm text-slate-500">Read-only preview</p>
          </div>
        </div>

        <Link
          to={`/admin/news/edit/${news.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiEdit2 />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 space-y-4">
        <div>
          <div className="text-2xl font-bold text-slate-800">{news.title}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Category: {news.category || '—'}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Status: {news.status || '—'}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Views: {news.views ?? 0}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Created: {news.created_at || '—'}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Schedule: {news.schedule_at || '—'}</span>
          </div>
        </div>

        {Array.isArray(news.images) && news.images.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-700">Images</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {news.images.map((img, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-28 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="p-2 text-xs text-slate-600 break-all">{img}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">Content</div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content || '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewNews;
