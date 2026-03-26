import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck
} from 'react-icons/fi';
import { categoryAPI } from '../../services/adminApi';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const name = watch('name');

  // Auto-generate slug
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await categoryAPI.update(editingId, data);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(data);
        toast.success('Category created successfully');
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save category');
    }
  };

  const openEditModal = (category) => {
    setEditingId(category.id);
    setValue('name', category.name);
    setValue('description', category.description);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    reset();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    reset();
  };

  const handleDelete = async () => {
    try {
      await categoryAPI.delete(deleteModal.id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 mt-1">Manage news categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 font-medium"
        >
          <FiPlus size={20} className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <span className="text-sky-600 font-bold text-lg">
                  {category.name.charAt(0)}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteModal({ show: true, id: category.id })}
                  className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{category.description}</p>
            <div className="flex items-center justify-end">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {category.news_count || 0} news
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name <span className="text-sky-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  placeholder="Category name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-sky-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  placeholder="Brief description..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
          >
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={24} className="text-sky-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Category?</h3>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Categories;
