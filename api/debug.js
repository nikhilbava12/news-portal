/**
 * Admin Backend API Debugger - JavaScript Version
 * Run this in browser console or Node.js to test all admin endpoints
 */

const API_BASE_URL = 'http://localhost/news/news-portal/api/index.php';
const ADMIN_EMAIL = 'admin@newsportal.com';
const ADMIN_PASSWORD = 'admin123';

class APIDebugger {
    constructor() {
        this.token = null;
        this.testIds = { news: null, category: null, tag: null };
    }

    async makeRequest(url, method = 'GET', data = null, useAuth = false) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (useAuth && this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        console.log(`\n%c→ ${method} ${url}`, 'color: blue; font-weight: bold');
        if (data) console.log('%cData:', 'color: gray', data);

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            const color = response.ok ? 'green' : 'red';
            console.log(`%c← HTTP ${response.status}`, `color: ${color}; font-weight: bold`);
            console.log('%cResponse:', 'color: gray', result);
            
            return { success: response.ok, status: response.status, data: result };
        } catch (error) {
            console.error('%cError:', 'color: red', error);
            return { success: false, error: error.message };
        }
    }

    async runAllTests() {
        console.log('%c=== Admin API Debugger ===', 'color: purple; font-size: 16px; font-weight: bold');
        console.log(`Base URL: ${API_BASE_URL}`);
        console.log(`Time: ${new Date().toLocaleString()}`);

        // 1. Setup
        await this.makeRequest(`${API_BASE_URL}/admin/setup`, 'POST');

        // 2. Login
        const loginResult = await this.makeRequest(`${API_BASE_URL}/admin/login`, 'POST', {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        if (loginResult.success && loginResult.data.token) {
            this.token = loginResult.data.token;
            console.log('%cToken received: ' + this.token.substring(0, 20) + '...', 'color: green');
        } else {
            console.error('%cLogin failed - stopping tests', 'color: red');
            return;
        }

        // 3. Dashboard
        await this.makeRequest(`${API_BASE_URL}/admin/dashboard`, 'GET', null, true);

        // 4. Categories
        const categories = await this.makeRequest(`${API_BASE_URL}/admin/categories`, 'GET', null, true);
        
        const newCategory = await this.makeRequest(`${API_BASE_URL}/admin/categories`, 'POST', {
            name: `Test Category ${Date.now()}`,
            slug: `test-category-${Date.now()}`
        }, true);
        
        if (newCategory.success) this.testIds.category = newCategory.data.id;

        // 5. Tags
        const tags = await this.makeRequest(`${API_BASE_URL}/admin/tags`, 'GET', null, true);
        
        const newTag = await this.makeRequest(`${API_BASE_URL}/admin/tags`, 'POST', {
            name: `Test Tag ${Date.now()}`
        }, true);
        
        if (newTag.success) this.testIds.tag = newTag.data.id;

        // 6. News
        const news = await this.makeRequest(`${API_BASE_URL}/admin/news`, 'GET', null, true);
        
        const newNews = await this.makeRequest(`${API_BASE_URL}/admin/news`, 'POST', {
            title: `Test Article ${Date.now()}`,
            slug: `test-article-${Date.now()}`,
            content: '<p>Test content</p>',
            shortDescription: 'Test description',
            category: this.testIds.category || 1,
            status: 'draft',
            tags: this.testIds.tag ? [this.testIds.tag] : []
        }, true);
        
        if (newNews.success) this.testIds.news = newNews.data.id;

        // 7. Get single news
        if (this.testIds.news) {
            await this.makeRequest(`${API_BASE_URL}/admin/news/${this.testIds.news}`, 'GET', null, true);
            
            // 8. Update news
            await this.makeRequest(`${API_BASE_URL}/admin/news/${this.testIds.news}`, 'PUT', {
                title: `Updated Article ${Date.now()}`,
                status: 'published'
            }, true);
        }

        // 9. Messages
        await this.makeRequest(`${API_BASE_URL}/admin/messages`, 'GET', null, true);

        // 10. Pages
        await this.makeRequest(`${API_BASE_URL}/admin/pages`, 'GET', null, true);

        // 11. Settings
        await this.makeRequest(`${API_BASE_URL}/admin/settings`, 'GET', null, true);
        await this.makeRequest(`${API_BASE_URL}/admin/settings`, 'PUT', {
            siteName: 'Debug Test Site'
        }, true);

        // Cleanup
        console.log('%c\n=== Cleanup ===', 'color: orange; font-weight: bold');
        
        if (this.testIds.news) {
            await this.makeRequest(`${API_BASE_URL}/admin/news/${this.testIds.news}`, 'DELETE', null, true);
        }
        if (this.testIds.category) {
            await this.makeRequest(`${API_BASE_URL}/admin/categories/${this.testIds.category}`, 'DELETE', null, true);
        }
        if (this.testIds.tag) {
            await this.makeRequest(`${API_BASE_URL}/admin/tags/${this.testIds.tag}`, 'DELETE', null, true);
        }

        console.log('%c\n=== Debug Complete ===', 'color: purple; font-size: 16px; font-weight: bold');
    }
}

// Usage:
// const debugger = new APIDebugger();
// debugger.runAllTests();

// For Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIDebugger;
}
