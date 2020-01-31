const Auth = require('./authModel');
const database = require('../data/config');

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
        await Auth.register({
            email: 'test email',
            username: 'test username',
            password: 'test password',
            role: 'test role',
            cohort: 'test cohort'
        });
        const users = await database('users');
        expect(users).toHaveLength(1);
    });
});