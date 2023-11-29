require('isomorphic-fetch');

const addr = {
    address: process.env.ADDRESS || 'localhost',
    port: process.env.PORT || 3000
};
const baseUrl = `http://${addr.address}:${addr.port}`;

describe('Article API', () => {

    let cookie; 

    it('should login a user before testing Article API', async () => {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testUser',
                password: 'password'
            })
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.username).toBe('testUser');
        expect(data.result).toBe('success');

        // Save the cookie for the logout test
        cookie = response.headers.get('set-cookie');
    });

    it('should post a new article', async () => {
        const response = await fetch(`${baseUrl}/article`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({
                text: 'This is a new article for testing'
            })
        });
    
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data.articles).toBeDefined();
        expect(data.articles[0].text).toBe('This is a new article for testing');
    });
    

    it('should get an article by ID', async () => {
        const articleId = 1; 
        const response = await fetch(`${baseUrl}/articles/${articleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        });
    
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.articles).toBeDefined();
        expect(data.articles.length).toBeGreaterThan(0);
        const article = data.articles.find(a => a.id === articleId);
        expect(article).toBeDefined();
        expect(article.author).toBe('testUser');
        expect(article.text).toBe('This is a new article for testing');
    });
    
    it('should get all articles for the logged-in user', async () => {
        const response = await fetch(`${baseUrl}/articles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        });
    
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data.articles)).toBe(true);
        expect(data.articles.length).toBeGreaterThan(0);
        expect(data.articles.some(a => a.author === 'testUser')).toBe(true);
        expect(data.articles.some(a => a.id === 1 && a.text === 'This is a new article for testing')).toBe(true);
    });

    it('should update an article text', async () => {
        const articleId = 1; 
        const newText = "Updated article text for testing";
    
        const response = await fetch(`${baseUrl}/articles/${articleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({
                text: newText
            })
        });
    
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.articles).toBeDefined();
        expect(data.articles[0].id).toBe(articleId);
        expect(data.articles[0].text).toBe(newText);
    });

    it('should add a comment to an article', async () => {
        const articleId = 1; 
        const commentText = "This is a new comment for testing";
    
        const response = await fetch(`${baseUrl}/articles/${articleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({
                text: commentText,
                commentId: -1
            })
        });
    
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.articles).toBeDefined();
        const article = data.articles.find(a => a.id === articleId);
        expect(article.comments.some(c => c.text === commentText)).toBe(true);
    });

});
