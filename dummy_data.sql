-- =====================================================
-- DUMMY DATA INSERT QUERIES
-- =====================================================

-- 1. Insert Categories
INSERT INTO categories (name, description, status) VALUES
('Politics', 'Political news and updates from around the world', 'active'),
('Technology', 'Technology news, innovation, and digital trends', 'active'),
('Sports', 'Sports coverage, results, and athletic news', 'active'),
('Business', 'Business, finance, and economic news', 'active'),
('Health', 'Health, wellness, and medical news', 'active'),
('Entertainment', 'Entertainment, movies, and celebrity news', 'active');

-- 2. Insert Admin (password: admin123)
INSERT INTO admin (username, password_hash, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@newsportal.com');
-- Note: The password_hash above is for 'password'. For production, use password_hash('admin123', PASSWORD_BCRYPT) in PHP

-- 3. Insert News Articles
INSERT INTO news (category_id, title, main_content, status, is_featured, is_breaking, is_trending, is_popular, total_views, trending_score, created_at) VALUES
-- Featured/Breaking News (Politics)
(1, 'Global Climate Summit Reaches Historic Agreement on Carbon Emissions', 
'<p>In a historic move, world leaders from 195 countries have agreed to cut carbon emissions by 50% before 2030. This landmark decision, reached at the Global Climate Summit in Geneva, represents the most ambitious climate target ever set by the international community.</p>
<p>The agreement includes binding commitments from major emitters including the United States, China, and the European Union. Under the new framework, developed nations will provide $100 billion annually to support climate adaptation in developing countries.</p>
<p>"This is a turning point for humanity," said UN Secretary-General António Guterres. "We have finally recognized that the climate crisis is an existential threat that requires unprecedented global cooperation."</p>
<p>The deal establishes a new international carbon trading system and requires all signatories to submit updated emission reduction plans every two years.</p>', 
'published', TRUE, TRUE, TRUE, TRUE, 125000, 95.5, NOW());

INSERT INTO news (category_id, title, main_content, status, is_breaking, is_trending, total_views, trending_score, created_at) VALUES
-- Breaking News (Technology)
(2, 'Revolutionary AI Chip Promises 100x Faster Processing Speed',
'<p>A major breakthrough in computing technology was announced today as TechNova unveiled their revolutionary Quantum-AI Hybrid Chip, codenamed "Aether." The new processor promises processing speeds 100 times faster than current flagship chips while consuming 60% less energy.</p>
<p>The chip combines traditional silicon architecture with quantum computing elements and specialized AI acceleration cores. Early benchmarks demonstrate unprecedented performance in machine learning tasks.</p>
<p>"This isn\'t just an incremental improvement," said Dr. Elena Vasquez, chief architect of the project. "We\'ve fundamentally reimagined how processors can handle information."</p>
<p>Commercial availability is expected by mid-2025.</p>',
'published', TRUE, TRUE, 98000, 88.2, DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO news (category_id, title, main_content, status, is_trending, is_popular, total_views, trending_score, created_at) VALUES
-- Trending Sports News
(3, 'Underdog Team Wins Historic Championship in Stunning Finals Victory',
'<p>In what experts are calling the greatest upset in modern sports history, the Richmond Tigers defeated the heavily favored Metro City Lions 3-2 in a thrilling championship final that went into double overtime.</p>
<p>The Tigers, who finished the regular season with a 12-28 record and barely made the playoffs as the 8th seed, completed an unprecedented run through the postseason.</p>
<p>"Nobody believed in us except ourselves," said team captain Marcus Thompson, holding the championship trophy with tears in his eyes.</p>
<p>Rookie sensation Jamie Park scored the game-winning goal with just 34 seconds remaining in the second overtime period.</p>',
'published', TRUE, TRUE, 145000, 92.1, DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT INTO news (category_id, title, main_content, status, is_trending, total_views, trending_score, created_at) VALUES
-- Business News
(4, 'Major Tech Companies Report Record Quarterly Earnings Despite Economic Concerns',
'<p>In a stunning display of resilience, the "Big Five" tech companies all reported quarterly earnings that significantly exceeded Wall Street expectations, sending their stock prices soaring in after-hours trading.</p>
<p>Combined, the five companies generated $485 billion in revenue for the quarter, up 18% year-over-year. Their collective profit margin of 28% demonstrates the continued strength of the technology sector.</p>
<p>Cloud computing services emerged as the standout performer, with business-to-business revenue growing 34% across all companies.</p>
<p>"We\'ve entered a new investment cycle," said CFO Lisa Park of Nexus Corp.</p>',
'published', TRUE, 87000, 76.4, DATE_SUB(NOW(), INTERVAL 3 DAY));

INSERT INTO news (category_id, title, main_content, status, is_breaking, is_trending, is_popular, total_views, trending_score, created_at) VALUES
-- Breaking Health News
(5, 'Breakthrough Cancer Treatment Shows 90% Remission Rate in Clinical Trials',
'<p>Medical researchers at Johns Hopkins University have announced results from Phase III clinical trials of a revolutionary cancer treatment that achieved a 90% remission rate in patients with previously untreatable advanced-stage cancers.</p>
<p>The treatment, called ImmunoSync, uses a novel combination of personalized gene therapy and enhanced immune system activation. Unlike traditional chemotherapy, it specifically targets cancer cells while leaving healthy tissue largely unaffected.</p>
<p>"We\'ve never seen results like this," said Dr. Maria Santos, lead researcher on the project. "Patients who were given months to live are now cancer-free two years after treatment."</p>
<p>The FDA has granted the treatment breakthrough therapy designation, potentially accelerating approval.</p>',
'published', TRUE, TRUE, TRUE, 210000, 98.7, DATE_SUB(NOW(), INTERVAL 4 DAY));

INSERT INTO news (category_id, title, main_content, status, is_trending, total_views, trending_score, created_at) VALUES
-- Entertainment News
(6, 'Award-Winning Director Announces Ambitious New Film Project',
'<p>Academy Award-winning director Christopher Nolan has announced his next project: an epic historical drama titled "The Silk Road Chronicles," which will trace the interconnected stories of merchants, warriors, and explorers across the ancient trade route.</p>
<p>The film will feature an unprecedented international ensemble cast of over 200 speaking roles, with actors from 25 countries performing in their native languages with subtitles. The budget is reported to be $350 million.</p>
<p>"This is the most ambitious project I\'ve ever undertaken," Nolan said at the press conference.</p>
<p>Filming is scheduled to begin next spring, with a projected release date in late 2026.</p>',
'published', TRUE, 156000, 84.3, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- More Politics News
INSERT INTO news (category_id, title, main_content, status, total_views, created_at) VALUES
(1, 'European Union Passes Landmark Digital Privacy Legislation',
'<p>The European Parliament has passed the Digital Privacy and Rights Act (DPRA), the most comprehensive update to digital privacy legislation in over a decade.</p>
<p>Key provisions include the right to data portability between services, mandatory AI disclosure when algorithms make decisions affecting users, and simplified consent mechanisms.</p>
<p>"Privacy is a fundamental human right, not a commodity to be traded," said Margrethe Vestager, European Commissioner for Competition.</p>',
'published', 76000, DATE_SUB(NOW(), INTERVAL 6 DAY));

-- More Technology News
INSERT INTO news (category_id, title, main_content, status, is_trending, total_views, trending_score, created_at) VALUES
(2, 'SpaceX Successfully Launches First Commercial Space Station Module',
'<p>SpaceX has successfully launched and deployed the first module of the world\'s first commercial space station, marking a new era in private space development.</p>
<p>The 15-ton module includes living quarters for 12 astronauts, research laboratories, and the first commercial zero-gravity manufacturing facility.</p>
<p>"This is the beginning of humanity\'s expansion into space as a civilization," said Elon Musk during the launch broadcast.</p>',
'published', TRUE, 189000, 89.5, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- More Sports News
INSERT INTO news (category_id, title, main_content, status, total_views, created_at) VALUES
(3, 'Olympic Committee Announces New Sports for 2028 Los Angeles Games',
'<p>The International Olympic Committee has announced the official program for the 2028 Los Angeles Olympics, featuring six new sports that reflect the evolving landscape of global athletic competition.</p>
<p>Breaking, skateboarding, sport climbing, surfing, esports, and padel tennis will all make their Olympic debuts.</p>
<p>"The Olympics must evolve to remain relevant to younger generations," said IOC President Thomas Bach.</p>',
'published', 112000, DATE_SUB(NOW(), INTERVAL 8 DAY));

-- More Business News
INSERT INTO news (category_id, title, main_content, status, is_breaking, total_views, created_at) VALUES
(4, 'Central Banks Coordinate Interest Rate Cut to Stimulate Global Economy',
'<p>In an unprecedented display of international coordination, the Federal Reserve, European Central Bank, Bank of England, and Bank of Japan simultaneously announced interest rate cuts of 0.5 percentage points each.</p>
<p>The coordinated action aims to combat the synchronized economic slowdown affecting major economies. Stock markets immediately surged, with the S&P 500 gaining 3.2%.</p>
<p>"Global economic conditions require a unified response," said Federal Reserve Chair Jerome Powell.</p>',
'published', TRUE, 167000, DATE_SUB(NOW(), INTERVAL 9 DAY));

-- More Health News
INSERT INTO news (category_id, title, main_content, status, total_views, created_at) VALUES
(5, 'Revolutionary Diet Research Reveals Gut Health Connection to Mental Wellness',
'<p>A landmark study published in the journal Nature Medicine has established a definitive connection between gut microbiome health and mental wellness.</p>
<p>The 10-year research project followed 50,000 participants, tracking their dietary habits, gut bacteria composition, and mental health markers.</p>
<p>"We\'ve discovered that certain gut bacteria produce serotonin, dopamine, and GABA," explained lead researcher Dr. Patricia Williams.</p>',
'published', 82000, DATE_SUB(NOW(), INTERVAL 10 DAY));

-- More Entertainment News
INSERT INTO news (category_id, title, main_content, status, is_trending, total_views, trending_score, created_at) VALUES
(6, 'Streaming Service Breaks Record with Most-Watched Series Premiere',
'<p>Netflix has shattered all previous records with the premiere of "The Chronicles of Aethermoor," a fantasy series that attracted 85 million global viewers during its opening weekend.</p>
<p>The $250 million production represents the streaming service\'s most ambitious original content investment to date.</p>
<p>"These numbers validate our strategy of investing in premium, event-level content," said Netflix CEO Ted Sarandos.</p>',
'published', TRUE, 198000, 91.2, DATE_SUB(NOW(), INTERVAL 11 DAY));

-- =====================================================
-- 4. Insert News Visuals (Images for each news)
-- =====================================================

-- News 1 - Featured Climate Summit
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1569163139394-de4798aa62b9?w=800', 'image', 0),
(1, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'image', 1);

-- News 2 - AI Chip
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(2, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'image', 0),
(2, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800', 'image', 1);

-- News 3 - Sports Championship
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800', 'image', 0);

-- News 4 - Business
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(4, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'image', 0);

-- News 5 - Health
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(5, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 'image', 0),
(5, 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800', 'image', 1);

-- News 6 - Entertainment
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(6, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', 'image', 0);

-- News 7 - Politics
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(7, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', 'image', 0);

-- News 8 - SpaceX
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(8, 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800', 'image', 0),
(8, 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800', 'image', 1);

-- News 9 - Olympics
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(9, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 'image', 0);

-- News 10 - Business
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(10, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', 'image', 0);

-- News 11 - Health
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(11, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', 'image', 0);

-- News 12 - Entertainment
INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES
(12, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', 'image', 0);

-- =====================================================
-- 5. Insert Daily Views (for trending calculation)
-- =====================================================

-- News 1 - High recent views (trending)
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(1, CURDATE(), 15000),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12000),
(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 18000);

-- News 2 - High recent views
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(2, CURDATE(), 22000),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 25000),
(2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 20000);

-- News 3 - Trending
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(3, CURDATE(), 18000),
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 15000),
(3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 20000);

-- News 4
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(4, CURDATE(), 5000),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 8000),
(4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 6000);

-- News 5 - Breaking (highest views)
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(5, CURDATE(), 35000),
(5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 28000),
(5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 32000);

-- News 6
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(6, CURDATE(), 12000),
(6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 11000),
(6, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 13000);

-- News 8 - SpaceX trending
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(8, CURDATE(), 20000),
(8, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 18000),
(8, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 16000);

-- News 12 - Entertainment
INSERT INTO daily_views (news_id, view_date, view_count) VALUES
(12, CURDATE(), 14000),
(12, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12000),
(12, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 11000);

-- =====================================================
-- VERIFY DATA
-- =====================================================

-- Check categories
SELECT * FROM categories;

-- Check news count per category
SELECT c.name, COUNT(n.news_id) as news_count 
FROM categories c 
LEFT JOIN news n ON c.id = n.category_id AND n.status = 'published'
GROUP BY c.id;

-- Check featured/breaking/trending news
SELECT news_id, title, is_featured, is_breaking, is_trending, is_popular, total_views 
FROM news 
WHERE is_featured = TRUE OR is_breaking = TRUE OR is_trending = TRUE;
