exports.up = (knex, Promise) => {
  return knex.schema
  //Permissions Table 
  .createTable("permissions", table => {
    table.increments();
    table.boolean("UC").defaultTo(false).notNullable();
    table.boolean("UU").defaultTo(false).notNullable();
    table.boolean("UD").defaultTo(false).notNullable();
    table.boolean("PCU").defaultTo(false).notNullable();
    table.boolean("PCD").defaultTo(false).notNullable();
    table.boolean("RC").defaultTo(false).notNullable();
    table.boolean("RU").defaultTo(false).notNullable();
    table.boolean("RD").defaultTo(false).notNullable();
})
    .createTable('roles', (table) => {
      table.increments();
      table.string('role').notNullable().unique();
      //Added Permission's colorm for roles table 
      table.integer("permission_id").references("id").inTable("permissions").onDelete("CASCADE").onUpdate("CASCADE");
    })
    //user_roles table 1 to 1 linking userid to role 
    .createTable("user_roles", table => {
      table.increments();
      table.string('user_id').notNullable().unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('role_id').notNullable().unsigned().references('id').inTable('roles').onUpdate('CASCADE').onDelete('CASCADE');
      table.unique(["user_id", "role_id"]);
  })
    .createTable('users', (table) => {
      table.string('id').unique();
      table.string('email').notNullable().unique();
      table.string('display_name').index();
      table.string('profile_picture');
      table.string('track');
      table.boolean('onboarded').defaultTo('false');
      table.timestamps(true, true);
      table
        .integer('role_id')
        .notNullable()
        .unsigned()
        .defaultTo(1)
        .references('id')
        .inTable('roles')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.boolean('visible').defaultTo(1);
    })
    .createTable('posts', (table) => {
      table.increments();
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.text('title').notNullable().index();
      table.text('description').notNullable().index();
      table.integer('likes').defaultTo(0);
      table.integer('comments').defaultTo(0);
      table.boolean('visible').defaultTo(1);
      table.timestamps(true, true);
    })
    .createTable('comments', (table) => {
      table.increments();
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.text('comment').notNullable();
      table.integer('likes').defaultTo(0);
      table.boolean('visible').defaultTo(1);
      table.timestamps(true, true);
    })
    .createTable('flagged_posts', (table) => {
      table.increments();
      table
        .integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.boolean('reviewed').defaultTo(0);
    })
    .createTable('flagged_comments', (table) => {
      table.increments();
      table
        .integer('comment_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('comments')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.boolean('reviewed').defaultTo(0);
    })
    .createTable('liked_posts', (table) => {
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('liked_comments', (table) => {
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('comment_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('comments')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('saved_posts', (table) => {
      table
        .string('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    //Added ICON and Banner_iamge in 
    .createTable('rooms', (table) => {
      table.increments();
      table.string('room_name').notNullable().unique();
      table.string('description').notNullable().unique();
      table.string("icon").notNullable().defaultTo("localhost:5000/images/room-icon.png");
      table.string("banner_image").notNullable().defaultTo("localhost:5000/images/room-banner.jpg");
    })
    .createTable('tags', (table) => {
      table.increments();
      table.string('tag_name').notNullable().unique();
    })
    .createTable('rooms_to_posts', (table) => {
      table.increments();
      table
        .integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('room_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('rooms')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('posts_to_tags', (table) => {
      table.increments();
      table
        .integer('post_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('tag_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('tags')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTableIfExists('posts_to_tags')
    .dropTableIfExists('rooms_to_posts')
    .dropTableIfExists('tags')
    .dropTableIfExists('rooms')
    .dropTableIfExists('saved_posts')
    .dropTableIfExists('liked_comments')
    .dropTableIfExists('liked_posts')
    .dropTableIfExists('flagged_comments')
    .dropTableIfExists('comments')
    .dropTableIfExists('flagged_posts')
    .dropTableIfExists('posts')
    .dropTableIfExists('users')
    .dropTableIfExists('roles')
    .dropTableIfExists('user_roles')
    .dropTableIfExists('permissions')

};
