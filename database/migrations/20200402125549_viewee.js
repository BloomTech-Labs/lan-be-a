exports.up = (knex, Promise) => {
  return knex.schema
    .createTable("roles", (table) => {
      table.increments();
      table.string().notNullable();
    })
    .createTable("users", (table) => {
      table.string("id").unique();
      table.string("email").notNullable().unique();
      table.string("display_name").index();
      table.string("profile_picture");
      // I believe the components are there in the frontend for manual sign-ups and sign-ins, but due to design decisions and security concerns,
      // I don't think we will be doing them. Commenting out just in case.
      // table.string('password');
      table.string("track");
      // table.integer("likes").defaultTo(0);
      table.boolean("onboarded").defaultTo("false");
      table.timestamps(true, true);
      table
        .string("role_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("roles")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("posts", (table) => {
      table.increments();
      table
        .string("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.text("title").notNullable().index();
      table.text("body").notNullable().index();
      // table.integer("likes").defaultTo(0);
      // table.integer("comments").defaultTo(0);
      // table
      //   .string("track")
      //   // .notNullable()
      //   .index();
      // table.string("category").notNullable().index();
      table.timestamps(true, true);
    })
    .createTable("comments", (table) => {
      table.increments();
      table
        .string("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.text("comment").notNullable();
      // table.integer("likes").defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable("liked_posts", (table) => {
      table
        .string("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("liked_comments", (table) => {
      table
        .string("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("comment_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("comments")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("saved_posts", (table) => {
      table
        .string("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("rooms", (table) => {
      table.increments();
      table.string("room_name").notNullable().unique();
      table.string("description").notNullable().unique();
    })
    .createTable("tags", (table) => {
      table.increments();
      table.string("tag_name").notNullable().unique();
    })
    .createTable("rooms_to_posts", (table) => {
      table.increments();
      table
        .string("post_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("room_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("rooms")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("posts_to_tags", (table) => {
      table.increments();
      table
        .string("post_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("posts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("tag_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("tags")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTableIfExists("posts_to_tags")
    .dropTableIfExists("rooms_to_posts")
    .dropTableIfExists("tags")
    .dropTableIfExists("rooms")
    .dropTableIfExists("saved_posts")
    .dropTableIfExists("liked_comments")
    .dropTableIfExists("liked_posts")
    .dropTableIfExists("comments")
    .dropTableIfExists("posts")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
