import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiUser,
  FiClock,
  FiCheck,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { messageAPI } from '../../services/adminApi';
import { toast } from 'react-toastify';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getAll();
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await messageAPI.markAsRead(id);
      setMessages(messages.map((msg) =>
        msg.id === id ? { ...msg, status: 'read' } : msg
      ));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await messageAPI.delete(id);
      toast.success('Message deleted successfully');
      setMessages(messages.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-gray-500 mt-1">Manage incoming messages from visitors</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Messages</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">New Messages</p>
          <p className="text-2xl font-bold text-sky-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Read Messages</p>
          <p className="text-2xl font-bold text-green-600">{stats.read}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="relative md:w-48">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Messages</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'new') markAsRead(msg.id);
                }}
                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedMessage?.id === msg.id ? 'bg-sky-50 border-l-4 border-sky-500' : ''
                } ${msg.status === 'new' ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-800">{msg.name}</h3>
                        {msg.status === 'new' && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{msg.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{msg.date}</span>
                </div>
              </motion.div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-8">
                <FiMail size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {selectedMessage ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-bold text-lg">
                      {selectedMessage.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{selectedMessage.name}</h3>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="font-medium text-gray-800">{selectedMessage.subject}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 flex items-center">
                  <FiClock size={14} className="mr-1" />
                  Received: {selectedMessage.date}
                </p>
                <div className="flex items-center space-x-2">
                  {selectedMessage.status === 'new' && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Mark as read"
                    >
                      <FiCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <FiMail size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
