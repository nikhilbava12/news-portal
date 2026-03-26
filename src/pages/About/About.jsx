import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiTarget, FiGlobe } from 'react-icons/fi';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: 'Sarah Mitchell',
      role: 'Editor-in-Chief',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      bio: 'Award-winning journalist with 15 years of experience in political reporting.',
    },
    {
      name: 'David Chen',
      role: 'Senior Tech Correspondent',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Tech industry expert covering innovations in AI, quantum computing, and more.',
    },
    {
      name: 'Michael Torres',
      role: 'Sports Editor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      bio: 'Former professional athlete turned journalist with a passion for sports storytelling.',
    },
    {
      name: 'Jennifer Walsh',
      role: 'Business Reporter',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Financial analyst and journalist specializing in global markets and economics.',
    },
  ];

  const values = [
    {
      icon: FiAward,
      title: 'Excellence in Journalism',
      description: 'We uphold the highest standards of accuracy, fairness, and integrity in all our reporting.',
    },
    {
      icon: FiUsers,
      title: 'Diverse Perspectives',
      description: 'Our team brings together voices from different backgrounds to ensure comprehensive coverage.',
    },
    {
      icon: FiTarget,
      title: 'Truth & Transparency',
      description: 'We are committed to factual reporting and transparent correction of errors.',
    },
    {
      icon: FiGlobe,
      title: 'Global Reach',
      description: 'From local stories to international affairs, we cover what matters to our global audience.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-news-dark mb-6">
            About <span className="text-news-red">NewsPortal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted source for comprehensive, accurate, and timely news coverage. 
            We are dedicated to bringing you the stories that shape our world.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-news-dark text-white rounded-2xl p-8 md:p-12 mb-16"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              At NewsPortal, we believe in the power of informed citizens. Our mission is to provide 
              accurate, unbiased, and comprehensive news coverage that empowers our readers to understand 
              the world around them and make informed decisions. We are committed to journalistic excellence, 
              ethical reporting, and serving the public interest above all else.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-xl p-6">
                <p className="text-4xl font-bold text-news-red mb-2">50K+</p>
                <p className="text-gray-300">Daily Readers</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <p className="text-4xl font-bold text-news-red mb-2">100+</p>
                <p className="text-gray-300">Articles Daily</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <p className="text-4xl font-bold text-news-red mb-2">6</p>
                <p className="text-gray-300">News Categories</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-news-dark text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 text-center"
              >
                <div className="w-14 h-14 bg-news-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-news-red" size={28} />
                </div>
                <h3 className="text-lg font-bold text-news-dark mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-news-dark text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-news-dark mb-1">{member.name}</h3>
                  <p className="text-news-red font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-news-red to-red-700 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Have a story tip, feedback, or inquiry? We'd love to hear from you. 
            Reach out to our team and we'll get back to you as soon as possible.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-news-red font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Contact Us
          </a>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
