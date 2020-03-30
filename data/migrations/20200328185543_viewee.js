exports.up = (knex, Promise) => {
	return knex.schema
		.createTable('users', table => {
            table.increments();
            table.string('google_id')
                .unique();
            table.string('facebook_id')
                .unique();
            table.string('twitter_id')
                .unique();
			table.string('email')
				.notNullable()
				.unique();
			table.string('display_name')
				.index();
			table.string('profile_picture');
			table.string('password');
			table.string('role');
			table.string('track');
			table.integer('thumbs_up')
				.defaultTo(0);
			table.timestamps(true, true);
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
			table.integer('thumbs_up')
				.defaultTo(0);
			table.string('cohort')
				.notNullable()
				.index();
			table.string('category')
				.notNullable()
				.index();
			table.timestamps(true, true);
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
			table.integer('thumbs_up')
				.defaultTo(0);
			table.timestamps(true, true);
		}));
};

exports.down = (knex, Promise) => {
	return knex.schema
		.dropTableIfExists('replies')
		.dropTableIfExists('posts')
		.dropTableIfExists('users');
};