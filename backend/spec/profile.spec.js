// require('es6-promise').polyfill();
require('isomorphic-fetch');

const addr = {
    address: process.env.ADDRESS || 'localhost',
    port: process.env.PORT || 3000
};
const baseUrl = `http://${addr.address}:${addr.port}`;

describe('Authenticaton API', () => {

    let cookie;

    it('should register a new user', async () => {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testUser',
                email: 'test@example.com',
                phone: '1234567890',
                dob: '1990-01-01',
                zipcode: '12345',
                password: 'password'
            })
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.username).toBe('testUser');
        expect(data.result).toBe('success');
    });

    it('should login a user', async () => {
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

    it('should update the headline for a user', async () => {
        const response = await fetch(`${baseUrl}/headline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({
                headline: 'Test headline'
            })
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.username).toBe('testUser');
        expect(data.headline).toBe('Test headline');
    });

    it('should fetch the headline for a user', async () => {
        const response = await fetch(`${baseUrl}/headline/testUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.username).toBe('testUser');
        expect(data.headline).toBe('Test headline');
    });

    it('should logout a user', async () => {
        const response = await fetch(`${baseUrl}/logout`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        });

        expect(response.status).toBe(200);
    });

});

