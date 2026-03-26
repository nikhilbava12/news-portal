# News Portal Database Setup Guide

## Overview
This document provides the complete database structure and setup instructions for the News Portal project.

## Database Structure

### Core Tables

#### 1. `categories`
- Stores news categories (Politics, Technology, Sports, etc.)
- Fields: id, name, description, status, timestamps

#### 2. `news`
- Main news articles table
- Fields: news_id, category_id, title, main_content, excerpt, author, status, flags (featured, breaking, trending, popular), view counts, timestamps

#### 3. `admin`
- Administrator user accounts
- Fields: id, username, name, email, password_hash, timestamps

#### 4. `tags`
- News tags for categorization
- Fields: id, name, slug, created_at

#### 5. `news_tags`
- Junction table linking news and tags (many-to-many relationship)

#### 6. `news_visual`
- Stores images and media for news articles
- Fields: visual_id, news_id, visual_url, visual_type, sort_order, timestamps

#### 7. `views` & `daily_views`
- Track article views for analytics and trending calculations

#### 8. `messages`
- Contact form submissions
- Fields: id, name, email, subject, message, status, created_at

#### 9. `pages`
- Static pages (About, Contact, Privacy Policy, etc.)
- Fields: id, title, slug, content, meta data, status, timestamps

#### 10. `settings`
- Site configuration and settings
- Fields: id, setting_key, setting_value, timestamps

## Setup Instructions

### Method 1: Using the Setup Script

1. **Open phpMyAdmin** or your MySQL client
2. **Import the database setup script:**
   ```bash
   mysql -u root -p < database_setup.sql
   ```
3. **Or copy-paste the contents** of `database_setup.sql` into phpMyAdmin's SQL editor

### Method 2: Manual Setup

1. Create the database:
   ```sql
   CREATE DATABASE news_portal;
   USE news_portal;
   ```

2. Run the table creation queries from `db_schema.db`

3. Insert sample data from `dummy_data.sql`

## Default Login Credentials

After setup, you can use these admin credentials:

- **Email**: admin@newsportal.com
- **Password**: admin123

Additional admin accounts:
- **Email**: editor@newsportal.com
- **Password**: admin123

- **Email**: john@newsportal.com  
- **Password**: admin123

## Sample Data Included

### Categories (8)
- Politics, Technology, Sports, Business, Health, Entertainment, Science, World

### News Articles (10+)
- Featured and breaking news stories
- Trending and popular articles
- Multiple categories with realistic content
- Associated images and tags

### Tags (10)
- Breaking News, Trending, Featured, Climate, AI, Space, Healthcare, Economy, Sports, Technology

### Static Pages
- About Us, Contact Us, Privacy Policy

### Messages
- Sample contact form submissions

## Key Features

### News Management
- Full CRUD operations for news articles
- Category-based organization
- Tag system for flexible categorization
- Image/media support with multiple visuals per article
- Featured, breaking, trending, and popular flags

### Analytics
- View tracking system
- Daily view statistics
- Trending score calculations
- Popular article identification

### Admin Features
- User authentication system
- Role-based access control
- Message management
- Settings management
- Static page management

## API Endpoints

The database supports these main API endpoints:

- `GET /api/categories` - List all categories
- `GET /api/news` - List news with pagination and filters
- `GET /api/news/{id}` - Get single news article
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/trending` - Trending articles
- `GET /api/breaking` - Breaking news
- `GET /api/featured` - Featured articles

## Performance Optimizations

### Indexes
- Optimized indexes on frequently queried columns
- Composite indexes for complex queries
- Full-text search capability on news content

### Relationships
- Proper foreign key constraints
- Cascade delete for related data
- Efficient many-to-many relationships

## Security Considerations

- Password hashing using PHP's `password_hash()`
- SQL injection prevention with prepared statements
- Input validation and sanitization
- Proper error handling

## Maintenance

### Regular Tasks
- Clear old daily view data (optional)
- Update trending scores
- Optimize tables periodically
- Backup database regularly

### Monitoring
- Monitor database size
- Check query performance
- Review error logs
- Monitor user activity

## Troubleshooting

### Common Issues
1. **Connection errors**: Check database credentials in `api/db.php`
2. **Missing tables**: Run the setup script completely
3. **Permission errors**: Ensure MySQL user has proper privileges
4. **Encoding issues**: Use UTF-8 charset for all text fields

### Debug Mode
Enable debug mode in `api/index.php` by setting:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## Backup and Restore

### Backup
```bash
mysqldump -u root -p news_portal > backup.sql
```

### Restore
```bash
mysql -u root -p news_portal < backup.sql
```

## Support

For database-related issues:
1. Check MySQL error logs
2. Verify table structures
3. Test API endpoints individually
4. Review PHP error logs
