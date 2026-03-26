import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiX,
  FiSearch,
  FiTag,
  FiTrash2
} from 'react-icons/fi';
import { tagsAPI } from '../../services/adminApi';
import { toast } from 'react-toastify';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getAll();
      if (response.success) {
        setTags(response.tags);
      }
    } catch (error) {
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    try {
      await tagsAPI.create({ name: newTag.trim() });
      toast.success('Tag created successfully');
      setNewTag('');
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create tag');
    }
  };

  const deleteTag = async (id) => {
    try {
      await tagsAPI.delete(id);
      toast.success('Tag deleted successfully');
      fetchTags();
    } catch (error) {
      toast.error('Failed to delete tag');
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tags</h1>
        <p className="text-gray-500 mt-1">Manage news tags</p>
      </div>

      {/* Add Tag & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Add Tag */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Enter tag name..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              onClick={addTag}
              disabled={!newTag.trim()}
              className="px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FiPlus size={18} className="mr-2" />
              Add Tag
            </button>
          </div>

          {/* Search */}
          <div className="relative md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            All Tags ({filteredTags.length})
          </h2>
        </div>

        <div className="p-6">
          {filteredTags.length === 0 ? (
            <div className="text-center py-8">
              <FiTag size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No tags found</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {filteredTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="group inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-sky-50 rounded-lg transition-all"
                >
                  <span className="font-medium text-gray-700 group-hover:text-sky-600">
                    {tag.name}
                  </span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-xs text-gray-500">{tag.newsCount} news</span>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-sky-600 hover:bg-sky-100 rounded transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Tags</p>
          <p className="text-2xl font-bold text-gray-800">{tags.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Most Used</p>
          <p className="text-2xl font-bold text-gray-800">
            {tags.length > 0 ? tags.reduce((max, tag) => tag.newsCount > max.newsCount ? tag : max, tags[0]).name : '-'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Unused Tags</p>
          <p className="text-2xl font-bold text-gray-800">
            {tags.filter(t => t.newsCount === 0).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tags;
