exports.up = (knex, Promise) => {
	return knex.schema
		.createTable('users', table => {
			table.increments();
			table.string('email')
				.notNullable()
				.unique();
			table.string('username')
				.notNullable()
				.unique()
				.index();
			table.string('password')
				.notNullable();
			table.string('cohort')
				.notNullable();
			table.integer('iq')
				.defaultTo(0);
			table.timestamp('created_at', {useTz: true})
				.defaultTo(knex.fn.now());
		})
		.createTable('posts', table => {
			table.increments();
			table.integer('user_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			table.string('question')
				.notNullable()
				.index();
			table.text('answer')
				.notNullable()
				.index();
			table.integer('iq_points')
				.defaultTo(0);
			table.string('cohort')
				.notNullable()
				.index();
			table.string('category')
				.notNullable()
				.index();
			table.timestamp('created_at', {useTz: true})
				.defaultTo(knex.fn.now());
		})
		.createTable('replies', (table => {
			table.increments();
			table.integer('user_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			table.integer('post_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('posts')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			table.text('reply')
				.notNullable();
			table.integer('iq_points')
				.defaultTo(0);
			table.timestamp('created_at', {useTz: true})
				.defaultTo(knex.fn.now());
		}));
};

exports.down = (knex, Promise) => {
	return knex.schema
		.dropTableIfExists('replies')
		.dropTableIfExists('posts')
		.dropTableIfExists('users');
};