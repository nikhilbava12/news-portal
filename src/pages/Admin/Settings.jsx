import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FiSave,
  FiImage,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { settingsAPI } from '../../services/adminApi';
import { toast } from 'react-toastify';

const Settings = () => {
  const [logo, setLogo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      siteName: 'News Portal',
      siteDescription: 'Your trusted source for breaking news',
      contactEmail: 'contact@newsportal.com',
      contactPhone: '+1 (555) 123-4567',
      contactAddress: '123 News Street, Media City, NY 10001',
      facebook: 'https://facebook.com/newsportal',
      twitter: 'https://twitter.com/newsportal',
      instagram: 'https://instagram.com/newsportal',
      linkedin: 'https://linkedin.com/company/newsportal',
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      if (response.success && response.settings) {
        const s = response.settings;
        setValue('siteName', s.site_name || 'News Portal');
        setValue('siteDescription', s.site_description || '');
        setValue('contactEmail', s.contact_email || '');
        setValue('contactPhone', s.contact_phone || '');
        setValue('contactAddress', s.contact_address || '');
        setValue('facebook', s.facebook_url || '');
        setValue('twitter', s.twitter_url || '');
        setValue('instagram', s.instagram_url || '');
        setValue('linkedin', s.linkedin_url || '');
        
        // Set logo if available
        if (s.site_logo) {
          setLogo(s.site_logo);
        }
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await settingsAPI.update({
        site_name: data.siteName,
        site_description: data.siteDescription,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        contact_address: data.contactAddress,
        facebook_url: data.facebook,
        twitter_url: data.twitter,
        instagram_url: data.instagram,
        linkedin_url: data.linkedin,
        site_logo: logo,
      });
      setSaved(true);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
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
          setLogo(result.url);
          toast.success('Logo uploaded successfully');
        } else {
          toast.error(result.error || 'Failed to upload logo');
        }
      } catch (error) {
        toast.error('Failed to upload logo');
      }
    }
  };

  const inputClasses = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-2";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        </div>
        <p className="text-slate-500">Manage website configuration and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FiGlobe size={20} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">General Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Website Name</label>
              <input
                type="text"
                {...register('siteName')}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Website Logo</label>
              <div className="flex items-center space-x-4">
                {logo ? (
                  <div className="relative">
                    <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                    <FiImage size={24} className="text-slate-400" />
                  </div>
                )}
                <label className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl cursor-pointer transition-colors text-white font-medium">
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Site Description</label>
              <textarea
                {...register('siteDescription')}
                rows={3}
                className={inputClasses}
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiMail size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Contact Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Contact Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  {...register('contactEmail')}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Contact Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  {...register('contactPhone')}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  {...register('contactAddress')}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <FiFacebook size={20} className="text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Social Media Links</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Facebook</label>
              <div className="relative">
                <FiFacebook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="url"
                  {...register('facebook')}
                  className={`${inputClasses} pl-10`}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Twitter</label>
              <div className="relative">
                <FiTwitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="url"
                  {...register('twitter')}
                  className={`${inputClasses} pl-10`}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Instagram</label>
              <div className="relative">
                <FiInstagram className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="url"
                  {...register('instagram')}
                  className={`${inputClasses} pl-10`}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>LinkedIn</label>
              <div className="relative">
                <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="url"
                  {...register('linkedin')}
                  className={`${inputClasses} pl-10`}
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-4">
          {saved && (
            <span className="flex items-center text-emerald-600">
              <FiCheck size={18} className="mr-1" />
              Settings saved successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium flex items-center disabled:opacity-50 shadow-lg shadow-emerald-200"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <FiSave size={18} className="mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
