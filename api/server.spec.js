const request = require('supertest')
const server = require('./server.js');

describe('get /', () => {
    test('returns status 200', () => {
        return request(server).get('/')
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('returns server working', () => {
        return request(server).get('/')
            .then(res => {
                expect(res.body.message).toBe('server working');
            });
    });
});