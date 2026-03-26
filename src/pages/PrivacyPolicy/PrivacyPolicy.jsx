import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiUserCheck, FiEye, FiTrash2, FiMail } from 'react-icons/fi';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = 'March 15, 2024';

  const sections = [
    {
      icon: FiUserCheck,
      title: 'Information We Collect',
      content: `
        <p className="mb-4">We collect information that you provide directly to us, including:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Name and email address when you subscribe to our newsletter</li>
          <li>Contact information when you reach out through our contact form</li>
          <li>Information you provide when commenting on articles</li>
          <li>Usage data and analytics when you browse our website</li>
        </ul>
      `,
    },
    {
      icon: FiEye,
      title: 'How We Use Your Information',
      content: `
        <p className="mb-4">We use the information we collect to:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Provide and maintain our news services</li>
          <li>Send you newsletters and updates you've subscribed to</li>
          <li>Respond to your inquiries and feedback</li>
          <li>Improve our website and user experience</li>
          <li>Detect and prevent fraud or abuse</li>
        </ul>
      `,
    },
    {
      icon: FiLock,
      title: 'Data Security',
      content: `
        <p class="mb-4">We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>SSL/TLS encryption for data transmission</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication measures</li>
          <li>Secure data storage practices</li>
        </ul>
      `,
    },
    {
      icon: FiShield,
      title: 'Your Privacy Rights',
      content: `
        <p class="mb-4">You have the right to:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent for data processing</li>
        </ul>
      `,
    },
    {
      icon: FiTrash2,
      title: 'Data Retention',
      content: `
        <p class="mb-4">We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.</p>
      `,
    },
    {
      icon: FiMail,
      title: 'Contact Us',
      content: `
        <p class="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
        <p class="font-medium">Email: privacy@newsportal.com</p>
        <p class="font-medium">Address: 123 News Street, Media City, NY 10001</p>
      `,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-news-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiShield className="text-news-red" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-news-dark mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </motion.section>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8"
        >
          <p className="text-gray-700 leading-relaxed">
            At NewsPortal, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website. Please read this 
            privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-news-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="text-news-red" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-news-dark">{section.title}</h2>
                </div>
                <div 
                  className="text-gray-600 leading-relaxed ml-16"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gray-50 rounded-xl p-6 text-center"
        >
          <p className="text-gray-600 mb-4">
            This privacy policy may be updated from time to time. We will notify you of any changes 
            by posting the new policy on this page and updating the "Last updated" date.
          </p>
          <p className="text-gray-500 text-sm">
            By using our website, you consent to our Privacy Policy and agree to its terms.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
