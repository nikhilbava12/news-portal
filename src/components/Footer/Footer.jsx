import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin, FiRss, FiArchive } from 'react-icons/fi';
import { categories } from '../../data/dummyNews';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Advertise', path: '/advertise' },
  ];

  const companyLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Sitemap', path: '/sitemap' },
    { name: 'RSS Feed', path: '/rss', icon: FiRss },
    { name: 'Archives', path: '/archives', icon: FiArchive },
  ];

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-16">
      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  News<span className="text-red-500">Portal</span>
                </h2>
                <p className="text-gray-500 text-xs">Your Trusted News Source</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of the stories that matter most. Stay informed with NewsPortal.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-red-500" size={16} />
                </div>
                <span className="text-gray-400 text-sm">
                  123 News Street, Media City<br />
                  Mumbai, India 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-red-500" size={16} />
                </div>
                <span className="text-gray-400 text-sm">
                  +91 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-red-500" size={16} />
                </div>
                <span className="text-gray-400 text-sm">
                  contact@newsportal.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NewsPortal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                >
                  {link.icon && <link.icon size={14} />}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
