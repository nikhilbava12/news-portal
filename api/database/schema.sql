-- Admin Panel Database Schema
-- Run this SQL to create all necessary tables for the admin panel

-- Admin users table
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT 'Administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News articles table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    short_description TEXT,
    category_id INT,
    featured_image VARCHAR(255),
    image_caption VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    is_breaking BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- News-Tag relationship table
CREATE TABLE IF NOT EXISTS news_tags (
    news_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (news_id, tag_id),
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Static pages table (About, Privacy, etc.)
CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
INSERT INTO admin (username, email, password_hash, name) 
SELECT 'admin', 'admin@newsportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator'
WHERE NOT EXISTS (SELECT 1 FROM admin LIMIT 1);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Politics', 'politics', 'Political news and updates'),
('Technology', 'technology', 'Tech news and innovations'),
('Sports', 'sports', 'Sports coverage and results'),
('Business', 'business', 'Business and finance news'),
('Health', 'health', 'Health and wellness news'),
('Entertainment', 'entertainment', 'Entertainment and celebrity news')
ON DUPLICATE KEY UPDATE name=name;

-- Insert default pages
INSERT INTO pages (slug, title, content) VALUES
('about', 'About Us', '<h2>About News Portal</h2><p>Welcome to News Portal, your trusted source for the latest news.</p>'),
('privacy', 'Privacy Policy', '<h2>Privacy Policy</h2><p>We take your privacy seriously.</p>')
ON DUPLICATE KEY UPDATE slug=slug;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'News Portal'),
('site_description', 'Your trusted source for breaking news'),
('contact_email', 'contact@newsportal.com'),
('contact_phone', '+1 (555) 123-4567'),
('facebook_url', 'https://facebook.com/newsportal'),
('twitter_url', 'https://twitter.com/newsportal'),
('instagram_url', 'https://instagram.com/newsportal'),
('site_logo', '')
ON DUPLICATE KEY UPDATE setting_key=setting_key;
