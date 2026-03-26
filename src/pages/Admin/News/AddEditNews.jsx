import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import { FiArrowLeft, FiSave, FiX, FiCheck } from 'react-icons/fi';
import { newsAPI, categoryAPI } from '../../../services/adminApi';
import { toast } from 'react-toastify';

import Quill from 'quill';

const Font = Quill.import('formats/font');
Font.whitelist = ['sans', 'serif', 'monospace'];
Quill.register(Font, true);

const Size = Quill.import('attributors/class/size');
Size.whitelist = ['small', 'normal', 'large', 'huge'];
Quill.register(Size, true);

const AddEditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const quillRef = useRef(null);

  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      status: 'draft',
      schedule_at: '',
      trending_score: 0,
      isBreaking: false,
      isTrending: false,
      isPopular: false,
      isFeatured: false,
    },
  });

  useEffect(() => {
    const load = async () => {
      if (isEditing) {
        // Ensure category options exist before setting select value.
        await fetchCategories();
        await fetchNews();
      } else {
        await fetchCategories();
      }
    };

    load();
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.success && response.categories) {
        const apiCategories = response.categories;
        const selected = (selectedCategoryName || '').toString().trim();

        if (selected) {
          const hasSelected = apiCategories.some((c) => (c?.name || '').toString().trim() === selected);
          setCategories(hasSelected ? apiCategories : [...apiCategories, { id: `selected-${selected}`, name: selected }]);
        } else {
          setCategories(apiCategories);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getById(id);
      if (response.success && response.news) {
        const n = response.news;
        setValue('title', n.title);
        // Admin API returns both category_id and category name (category)
        // Form stores category name to match admin API create/update contract
        const normalizedCategory = (n.category || '').toString().trim();
        setSelectedCategoryName(normalizedCategory);
        setValue('category', normalizedCategory);

        if (normalizedCategory) {
          setCategories((prev) => {
            const list = Array.isArray(prev) ? prev : [];
            const hasSelected = list.some((c) => (c?.name || '').toString().trim() === normalizedCategory);
            return hasSelected ? list : [...list, { id: `selected-${normalizedCategory}`, name: normalizedCategory }];
          });
        }
        setValue('status', n.status);
        setValue('schedule_at', n.schedule_at ? n.schedule_at.slice(0, 16) : '');
        setValue('trending_score', n.trending_score || 0);
        setValue('isBreaking', n.is_breaking);
        setValue('isTrending', n.is_trending);
        setValue('isPopular', n.is_popular);
        setValue('isFeatured', n.is_featured);
        setContent(n.content || '');
        if (n.tags) setTags(n.tags.split(',').filter(Boolean));
        if (n.images) {
          // API returns images as array of urls; normalize to array of strings
          setImages(Array.isArray(n.images) ? n.images : []);
        }
      }
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://localhost/news-portal/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        if (result.success) {
          setImages([...images, result.url]);
          toast.success('Image uploaded successfully');
        } else {
          toast.error(result.error || 'Failed to upload image');
        }
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const handleImageUrlAdd = () => {
    const input = document.getElementById('imageUrlInput');
    const url = input.value.trim();
    if (url) {
      setImages([...images, url]);
      input.value = '';
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    
    const newsData = {
      title: data.title,
      content,
      // Admin API expects category as category name (it converts to category_id internally)
      category: data.category,
      status: data.status,
      schedule_at: data.schedule_at || null,
      trending_score: parseFloat(data.trending_score) || 0,
      isBreaking: data.isBreaking,
      isTrending: data.isTrending,
      isPopular: data.isPopular,
      isFeatured: data.isFeatured,
      tags,
      images: Array.isArray(images) ? images : [],
    };

    try {
      if (isEditing) {
        await newsAPI.update(id, newsData);
        toast.success('News updated successfully');
      } else {
        await newsAPI.create(newsData);
        toast.success('News created successfully');
      }
      navigate('/admin/news');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const quillModules = {
    toolbar: [
      [{ font: Font.whitelist }],
      [{ size: Size.whitelist }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <span className="text-slate-600">Loading news data...</span>
        </div>
      )}
      
      {/* Header */}
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
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                {isEditing ? 'Edit News' : 'Add News'}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Update the news article details' : 'Create a new news article'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit({ ...data, status: 'draft' }))}
            disabled={saving}
            className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all font-medium shadow-sm"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit({ ...data, status: 'published' }))}
            disabled={saving}
            className="px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition-all font-medium flex items-center shadow-lg shadow-emerald-200"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <FiCheck size={18} className="mr-2" />
            )}
            Publish
          </button>
        </div>
      </div>

      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter news title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content <span className="text-rose-500">*</span>
            </label>
            <div ref={quillRef}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white rounded-xl"
                style={{ height: '300px', marginBottom: '50px' }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 bg-sky-100 text-sky-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 hover:text-sky-800"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Flags */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-4">
              News Flags
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isBreaking')}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-gray-700">Breaking News</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isTrending')}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-gray-700">Trending</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isPopular')}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-gray-700">Popular</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isFeatured')}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          {/* Schedule At */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Schedule At
            </label>
            <input
              type="datetime-local"
              {...register('schedule_at')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to publish immediately</p>
          </div>

          {/* Trending Score */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Trending Score
            </label>
            <input
              type="number"
              step="0.01"
              {...register('trending_score')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="0.00"
            />
          </div>

          {/* Images Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Images
            </label>
            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img
                    src={typeof img === 'string' ? img : img?.url}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="flex-1 text-sm text-gray-600 truncate">
                    {typeof img === 'string' ? img : img?.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <label className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer text-sm font-medium">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  id="imageUrlInput"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const url = e.target.value.trim();
                      if (url) {
                        setImages([...images, url]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500">Upload images or enter image URLs</p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};

export default AddEditNews;
