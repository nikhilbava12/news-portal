import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import {
  FiSave,
  FiFileText,
  FiInfo,
  FiCheck
} from 'react-icons/fi';
import { pagesAPI } from '../../services/adminApi';
import { toast } from 'react-toastify';

const Pages = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const aboutQuillRef = useRef(null);
  const privacyQuillRef = useRef(null);

  const [aboutContent, setAboutContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      aboutTitle: 'About Us',
      privacyTitle: 'Privacy Policy',
    },
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await pagesAPI.getAll();
      if (response.success && response.pages) {
        const aboutPage = response.pages.find(p => p.slug === 'about');
        const privacyPage = response.pages.find(p => p.slug === 'privacy');
        
        if (aboutPage) {
          setValue('aboutTitle', aboutPage.title);
          setAboutContent(aboutPage.content);
        }
        if (privacyPage) {
          setValue('privacyTitle', privacyPage.title);
          setPrivacyContent(privacyPage.content);
        }
      }
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await pagesAPI.update({
        slug: activeTab,
        title: activeTab === 'about' ? data.aboutTitle : data.privacyTitle,
        content: activeTab === 'about' ? aboutContent : privacyContent,
      });
      setSaved(true);
      toast.success('Page saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const tabs = [
    { id: 'about', label: 'About Us', icon: FiInfo },
    { id: 'privacy', label: 'Privacy Policy', icon: FiFileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pages</h1>
        <p className="text-gray-500 mt-1">Manage static pages content</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSaved(false);
                }}
                className={`flex items-center px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  {...register('aboutTitle')}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div ref={aboutQuillRef}>
                  <ReactQuill
                    theme="snow"
                    value={aboutContent}
                    onChange={setAboutContent}
                    modules={quillModules}
                    style={{ height: '400px', marginBottom: '50px' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  {...register('privacyTitle')}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div ref={privacyQuillRef}>
                  <ReactQuill
                    theme="snow"
                    value={privacyContent}
                    onChange={setPrivacyContent}
                    modules={quillModules}
                    style={{ height: '400px', marginBottom: '50px' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="flex items-center space-x-4">
              {saved && (
                <span className="flex items-center text-green-600 text-sm">
                  <FiCheck size={16} className="mr-1" />
                  Saved successfully
                </span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all font-medium flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <FiSave size={18} className="mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pages;
