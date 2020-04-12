const User = require('./authModel');
const database = require('../database/dbConfig');

describe('test environment', () => {
    test('using the test environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });
});

describe('register', () => {
    beforeEach(async () => {
        await database('users').delete();
    });
    
    test('registers user', async () => {
        await User.add({
            email: 'test email',
            display_name: 'test display name',
            password: 'test password'
        });
        const users = await database('users');
        expect(users).toHaveLength(1);
    });
});