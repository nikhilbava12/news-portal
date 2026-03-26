-- =====================================================
-- NEWS PORTAL DATABASE SETUP SCRIPT
-- =====================================================
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS news_portal11;
USE news_portal11;

-- =====================================================
-- TABLE STRUCTURES
-- =====================================================

-- Categories Table
CREATE TABLE categories (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) DEFAULT 'active',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE tags (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL UNIQUE,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News Table
CREATE TABLE news (
    news_id         INT PRIMARY KEY AUTO_INCREMENT,
    category_id     INT,
    title           VARCHAR(500) NOT NULL,
    main_content    LONGTEXT NOT NULL,
    excerpt         TEXT,
    author          VARCHAR(255),
    status          VARCHAR(20) DEFAULT 'draft',
    schedule_at     DATETIME,
    total_views     INT DEFAULT 0,
    trending_score  DECIMAL(10,2) DEFAULT 0,
    is_trending     BOOLEAN DEFAULT FALSE,
    is_popular      BOOLEAN DEFAULT FALSE,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_breaking     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- News Tags Junction Table
CREATE TABLE news_tags (
    news_id         INT NOT NULL,
    tag_id          INT NOT NULL,
    PRIMARY KEY (news_id, tag_id),
    FOREIGN KEY (news_id) REFERENCES news(news_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- News Visuals Table (Images/Videos)
CREATE TABLE news_visual (
    visual_id       INT PRIMARY KEY AUTO_INCREMENT,
    news_id         INT NOT NULL,
    visual_url      VARCHAR(500) NOT NULL,
    visual_type     VARCHAR(20) DEFAULT 'image',
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news(news_id) ON DELETE CASCADE
);

-- Views Table
CREATE TABLE views (
    views_id        INT PRIMARY KEY AUTO_INCREMENT,
    news_id         INT NOT NULL,
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news(news_id) ON DELETE CASCADE
);

-- Daily Views Table (For trend calculation)
CREATE TABLE daily_views (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    news_id         INT NOT NULL,
    view_date       DATE NOT NULL,
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news(news_id) ON DELETE CASCADE,
    UNIQUE KEY unique_daily_view (news_id, view_date)
);

-- Admin Table
CREATE TABLE admin (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    username        VARCHAR(50) NOT NULL,
    name            VARCHAR(255),
    email           VARCHAR(255) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Messages Table (Contact Form)
CREATE TABLE messages (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    subject         VARCHAR(500),
    message         TEXT NOT NULL,
    status          VARCHAR(20) DEFAULT 'new',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages Table (Static Pages)
CREATE TABLE pages (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    content         LONGTEXT,
    meta_title      VARCHAR(255),
    meta_description TEXT,
    status          VARCHAR(20) DEFAULT 'published',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    setting_key     VARCHAR(100) NOT NULL UNIQUE,
    setting_value   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_trending ON news(is_trending);
CREATE INDEX idx_news_popular ON news(is_popular);
CREATE INDEX idx_news_featured ON news(is_featured);
CREATE INDEX idx_news_schedule ON news(schedule_at);
CREATE INDEX idx_news_created ON news(created_at);
CREATE INDEX idx_daily_views_date ON daily_views(view_date);
CREATE INDEX idx_news_visual_news ON news_visual(news_id);
CREATE INDEX idx_messages_status ON messages(status);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert Categories
INSERT INTO categories (name, description, status) VALUES
('Politics', 'Political news and updates from around the world', 'active'),
('Technology', 'Technology news, innovation, and digital trends', 'active'),
('Sports', 'Sports coverage, results, and athletic news', 'active'),
('Business', 'Business, finance, and economic news', 'active'),
('Health', 'Health, wellness, and medical news', 'active'),
('Entertainment', 'Entertainment, movies, and celebrity news', 'active'),
('Science', 'Scientific discoveries and research news', 'active'),
('World', 'International news and global affairs', 'active');

-- Insert Tags
INSERT INTO tags (name, slug) VALUES
('Breaking News', 'breaking-news'),
('Trending', 'trending'),
('Featured', 'featured'),
('Climate', 'climate'),
('AI', 'ai'),
('Space', 'space'),
('Healthcare', 'healthcare'),
('Economy', 'economy'),
('Sports', 'sports'),
('Technology', 'technology');

-- Insert Admin Users (password: admin123)
INSERT INTO admin (username, name, email, password_hash) VALUES
('admin', 'Administrator', 'admin@newsportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('editor', 'News Editor', 'editor@newsportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('john_doe', 'John Doe', 'john@newsportal.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert Sample News Articles
INSERT INTO news (category_id, title, main_content, excerpt, author, status, is_featured, is_breaking, is_trending, is_popular, total_views, trending_score, created_at) VALUES

-- Featured/Breaking News (Politics)
(1, 'Global Climate Summit Reaches Historic Agreement on Carbon Emissions', 
'<p>In a historic move, world leaders from 195 countries have agreed to cut carbon emissions by 50% before 2030. This landmark decision, reached at the Global Climate Summit in Geneva, represents the most ambitious climate target ever set by the international community.</p>
<p>The agreement includes binding commitments from major emitters including the United States, China, and the European Union. Under the new framework, developed nations will provide $100 billion annually to support climate adaptation in developing countries.</p>
<p>"This is a turning point for humanity," said UN Secretary-General António Guterres. "We have finally recognized that the climate crisis is an existential threat that requires unprecedented global cooperation."</p>
<p>The deal establishes a new international carbon trading system and requires all signatories to submit updated emission reduction plans every two years.</p>', 
'World leaders agree to cut carbon emissions by 50% before 2030 in historic climate summit.',
'Sarah Johnson', 'published', TRUE, TRUE, TRUE, TRUE, 125000, 95.5, NOW()),

-- Breaking News (Technology)
(2, 'Revolutionary AI Chip Promises 100x Faster Processing Speed',
'<p>A major breakthrough in computing technology was announced today as TechNova unveiled their revolutionary Quantum-AI Hybrid Chip, codenamed "Aether." The new processor promises processing speeds 100 times faster than current flagship chips while consuming 60% less energy.</p>
<p>The chip combines traditional silicon architecture with quantum computing elements and specialized AI acceleration cores. Early benchmarks demonstrate unprecedented performance in machine learning tasks.</p>
<p>"This isn\'t just an incremental improvement," said Dr. Elena Vasquez, chief architect of the project. "We\'ve fundamentally reimagined how processors can handle information."</p>
<p>Commercial availability is expected by mid-2025.</p>',
'TechNova unveils revolutionary Quantum-AI Hybrid Chip with 100x faster processing speeds.',
'Michael Chen', 'published', FALSE, TRUE, TRUE, FALSE, 98000, 88.2, DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Trending Sports News
(3, 'Underdog Team Wins Historic Championship in Stunning Finals Victory',
'<p>In what experts are calling the greatest upset in modern sports history, the Richmond Tigers defeated the heavily favored Metro City Lions 3-2 in a thrilling championship final that went into double overtime.</p>
<p>The Tigers, who finished the regular season with a 12-28 record and barely made the playoffs as the 8th seed, completed an unprecedented run through the postseason.</p>
<p>"Nobody believed in us except ourselves," said team captain Marcus Thompson, holding the championship trophy with tears in his eyes.</p>
<p>Rookie sensation Jamie Park scored the game-winning goal with just 34 seconds remaining in the second overtime period.</p>',
'Richmond Tigers complete historic championship upset against heavily favored Metro City Lions.',
'Alex Rodriguez', 'published', FALSE, FALSE, TRUE, TRUE, 145000, 92.1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Breaking Health News
(5, 'Breakthrough Cancer Treatment Shows 90% Remission Rate in Clinical Trials',
'<p>Medical researchers at Johns Hopkins University have announced results from Phase III clinical trials of a revolutionary cancer treatment that achieved a 90% remission rate in patients with previously untreatable advanced-stage cancers.</p>
<p>The treatment, called ImmunoSync, uses a novel combination of personalized gene therapy and enhanced immune system activation. Unlike traditional chemotherapy, it specifically targets cancer cells while leaving healthy tissue largely unaffected.</p>
<p>"We\'ve never seen results like this," said Dr. Maria Santos, lead researcher on the project. "Patients who were given months to live are now cancer-free two years after treatment."</p>
<p>The FDA has granted the treatment breakthrough therapy designation, potentially accelerating approval.</p>',
'Revolutionary cancer treatment achieves 90% remission rate in clinical trials.',
'Dr. Emily Watson', 'published', FALSE, TRUE, TRUE, TRUE, 210000, 98.7, DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- More sample articles
(1, 'European Union Passes Landmark Digital Privacy Legislation',
'<p>The European Parliament has passed the Digital Privacy and Rights Act (DPRA), the most comprehensive update to digital privacy legislation in over a decade.</p>
<p>Key provisions include the right to data portability between services, mandatory AI disclosure when algorithms make decisions affecting users, and simplified consent mechanisms.</p>',
'EU passes comprehensive digital privacy legislation with new rights for users.',
'Jean-Pierre Dubois', 'published', FALSE, FALSE, FALSE, FALSE, 76000, 45.2, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(2, 'SpaceX Successfully Launches First Commercial Space Station Module',
'<p>SpaceX has successfully launched and deployed the first module of the world\'s first commercial space station, marking a new era in private space development.</p>
<p>The 15-ton module includes living quarters for 12 astronauts, research laboratories, and the first commercial zero-gravity manufacturing facility.</p>',
'SpaceX launches first commercial space station module in historic mission.',
'Robert Kim', 'published', FALSE, FALSE, TRUE, FALSE, 189000, 89.5, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(3, 'Olympic Committee Announces New Sports for 2028 Los Angeles Games',
'<p>The International Olympic Committee has announced the official program for the 2028 Los Angeles Olympics, featuring six new sports that reflect the evolving landscape of global athletic competition.</p>',
'Breaking, skateboarding, and esports among new sports added to 2028 Olympics.',
'Lisa Thompson', 'published', FALSE, FALSE, FALSE, FALSE, 112000, 67.8, DATE_SUB(NOW(), INTERVAL 8 DAY)),

(4, 'Major Tech Companies Report Record Quarterly Earnings',
'<p>In a stunning display of resilience, the "Big Five" tech companies all reported quarterly earnings that significantly exceeded Wall Street expectations.</p>',
'Tech giants report record earnings despite economic concerns.',
'David Park', 'published', FALSE, FALSE, TRUE, FALSE, 87000, 76.4, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Insert News Visuals (Images)
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1569163139394-de4798aa62b9?w=800', 'image', 0),
(1, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'image', 1),
(2, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'image', 0),
(2, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800', 'image', 1),
(3, 'https://images.unsplash.com/photo-1560272564-c83b661ad12?w=800', 'image', 0),
(4, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 'image', 0),
(5, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', 'image', 0),
(6, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800', 'image', 0),
(7, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 'image', 0),
(8, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', 'image', 0);

-- Insert News Tags
INSERT INTO news_tags (news_id, tag_id) VALUES
(1, 1), (1, 4), (1, 2),
(2, 1), (2, 5), (2, 2), (2, 10),
(3, 2), (3, 9),
(4, 1), (4, 6), (4, 2),
(5, 7), (5, 1), (5, 2),
(6, 1),
(7, 6), (7, 2),
(8, 9), (8, 1),
(9, 10), (9, 2),
(10, 8), (10, 2);

-- Insert Daily Views (for trending calculation)
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(1, CURDATE(), 15000),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12000),
(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 18000),
(2, CURDATE(), 22000),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 25000),
(2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 20000),
(3, CURDATE(), 18000),
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 15000),
(3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 20000),
(4, CURDATE(), 35000),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 28000),
(4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 32000);

-- Insert Sample Messages
INSERT INTO messages (name, email, subject, message, status) VALUES
('John Smith', 'john.smith@email.com', 'Breaking News Coverage', 'Great coverage of the climate summit! Keep up the excellent work.', 'read'),
('Emily Johnson', 'emily.j@email.com', 'Sports Article', 'The championship article was inspiring. More sports content please!', 'new'),
('Michael Brown', 'mbrown@company.com', 'Advertising Inquiry', 'We would like to advertise on your platform. Please contact us.', 'new');

-- Insert Static Pages
INSERT INTO pages (title, slug, content, meta_title, meta_description, status) VALUES
('About Us', 'about-us', '<h1>About News Portal</h1><p>We are dedicated to bringing you the latest news from around the world.</p>', 'About News Portal', 'Learn about our mission and values', 'published'),
('Contact Us', 'contact', '<h1>Contact Information</h1><p>Email: contact@newsportal.com</p><p>Phone: +1-555-0123</p>', 'Contact News Portal', 'Get in touch with our editorial team', 'published'),
('Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us. Read our policy here.</p>', 'Privacy Policy', 'Our privacy practices and policies', 'published');

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'News Portal'),
('site_description', 'Your trusted source for breaking news and in-depth analysis'),
('contact_email', 'contact@newsportal.com'),
('social_facebook', 'https://facebook.com/newsportal'),
('social_twitter', 'https://twitter.com/newsportal'),
('posts_per_page', '10'),
('enable_comments', 'true');

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Display summary
SELECT 'Database setup completed successfully!' as message;
SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as news_count FROM news WHERE status = 'published';
SELECT COUNT(*) as admin_count FROM admin;
