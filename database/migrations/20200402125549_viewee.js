exports.up = (knex, Promise) => {
	return knex.schema
		.createTable('users', table => {
			// table.increments();
			table.string('id')
				.unique();
            // table.string('google_id')
			// 	.unique();
			// Refer to passportSetup.js as to why these are commented out.
            // table.string('facebook_id')
            //     .unique();
            // table.string('twitter_id')
            //     .unique();
			table.string('email')
				.notNullable()
				.unique();
			table.string('display_name')
				.index();
			table.string('profile_picture');
			// I believe the components are there in the frontend for manual sign-ups and sign-ins, but due to design decisions and security concerns,
			// I don't think we will be doing them. Commenting out just in case.
			// table.string('password');
			table.string('track');
			table.integer('likes')
				.defaultTo(0);
			table.timestamps(true, true);
		})
		.createTable('posts', table => {
			table.increments();
			table.string('user_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			table.text('question')
				.notNullable()
				.index();
			table.text('answer')
				.notNullable()
				.index();
			table.integer('likes')
				.defaultTo(0);
			table.integer('comments')
				.defaultTo(0);
			table.string('track')
				// .notNullable()
				.index();
			table.string('category')
				.notNullable()
				.index();
			table.timestamps(true, true);
		})
		.createTable('comments', table => {
			table.increments();
			table.string('user_id')
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
			table.text('comment')
				.notNullable();
			table.integer('likes')
				.defaultTo(0);
			table.timestamps(true, true);
		})
		.createTable('liked_posts', table => {
			table.string('user_id')
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
		})
		.createTable('liked_comments', table => {
			table.string('user_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			table.integer('comment_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('comments')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
		})
		.createTable('saved_posts', table => {
			table.string('user_id')
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
		});
};

exports.down = (knex, Promise) => {
	return knex.schema
		.dropTableIfExists('saved_posts')
		.dropTableIfExists('liked_comments')
		.dropTableIfExists('liked_posts')
		.dropTableIfExists('comments')
		.dropTableIfExists('posts')
		.dropTableIfExists('users');
};