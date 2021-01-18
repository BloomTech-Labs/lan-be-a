require('dotenv').config();

module.exports = {
	development: {
		client: 'pg',
		connection: {
			database: process.env.DATABASE,
			user: process.env.USER,
			password: process.env.PASSWORD
		},
		migrations: {
			directory: './database/migrations'
		}
	},

	production: {
		client: 'pg',
		connection: `${process.env.DATABASE_URL}?ssl=no-verify`,
		migrations: {
			directory: './database/migrations'
		}
	}
};
