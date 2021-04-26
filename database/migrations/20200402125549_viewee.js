// eslint-disable-next-line no-unused-vars
exports.up = (knex, Promise) => {
  return (
    knex.schema
      // Permissions
      .createTable("permissions", (table) => {
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

      // Roles
      .createTable("roles", (table) => {
        table.increments();
        table.string("role").notNullable();
        table
          .integer("permission_id")
          .references("id")
          .inTable("permissions")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })

      // Flagged Reason
      .createTable("flagged_reason", (table) => {
        table.increments();
        table.string("reason").notNullable().unique();
        table.integer("weight").notNullable();
      })

      // Users
      .createTable("users", (table) => {
        table.string("id").unique();
        table.string("email").notNullable().unique();
        table.string("display_name").unique().index();
        table.string("profile_picture");
        table.string("track");
        table.string("github_username").unique();
        table.string("user_bio");
        table.integer("following").defaultTo(0);
        table.boolean("onboarded").defaultTo("false");
        table.timestamps(true, true);
        table
          .integer("role_id")
          .notNullable()
          .unsigned()
          .defaultTo(1)
          .references("id")
          .inTable("roles")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.boolean("visible").defaultTo(1);
      })

      // User Roles (appointment between User and Role)
      .createTable("user_roles", (table) => {
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
          .integer("role_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("roles")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.unique(["user_id", "role_id"]);
      })

      // Posts
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
        table.text("description").notNullable().index();
        table.integer("likes").defaultTo(0);
        table.integer("comments").defaultTo(0);
        table.boolean("visible").defaultTo(1);
        table.timestamps(true, true);
      })

      // Comments
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
        table.integer("likes").defaultTo(0);
        table.boolean("visible").defaultTo(1);
        table.timestamps(true, true);
      })

      // Flagged Posts
      // (appointment between Post, User(flagger) and Flagged Reason)
      // (includes option "note" from flagger)
      .createTable("flagged_posts", (table) => {
        table.increments();
        table
          .integer("post_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("posts")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .string("user_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .integer("reason_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("flagged_reason")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("note", 255);
        table.boolean("reviewed").defaultTo(0);
      })

      // Flagged Comments
      // (appointment between Comment, User(flagger) and Flagged Reason)
      // (includes optional "note" from flagger)
      .createTable("flagged_comments", (table) => {
        table.increments();
        table
          .integer("comment_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("comments")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .string("user_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .integer("reason_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("flagged_reason")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("note", 255);
        table.boolean("reviewed").defaultTo(0);
      })

      // Liked Posts (appointment between User(liker) and Post)
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

      // Liked Comment (appointment between User(liker) and Comment)
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

      // Saved Posts (appointment between User(saver) and Post)
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

      // Rooms
      .createTable("rooms", (table) => {
        table.increments();
        table.string("room_name").notNullable().unique();
        table.string("description").notNullable().unique();
        table.boolean("private").defaultTo(false);
      })

      // Room To Moderator (appointment between User(moderator) and Room)
      .createTable("room_to_moderator", (table) => {
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
          .integer("room_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("rooms")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
      })

      // Tags
      .createTable("tags", (table) => {
        table.increments();
        table.string("tag_name").notNullable().unique();
      })

      // Rooms To Posts (appointment between Post and Room)
      .createTable("rooms_to_posts", (table) => {
        table.increments();
        table
          .integer("post_id")
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

      // Link private rooms to users table
      .createTable("rooms_to_users", (table) => {
        table
          .integer("room_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("rooms")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .string("user_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.primary(["room_id", "user_id"]);
      })

      // Posts To Tags (appointment between Post and Tag)
      .createTable("posts_to_tags", (table) => {
        table.increments();
        table
          .integer("post_id")
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
      })

      // My_room table to hold followed rooms
      .createTable("my_room", (table) => {
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
          .integer("room_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("rooms")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
      })

      // Create message table
      .createTable("messages", (table) => {
        table.increments();
        table
          .string("user_send_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .string("user_receive_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("message").notNullable();
        table.boolean("viewed").defaultTo(false);
        table.timestamps(true, true);
      })

      // Create following table
      .createTable("following", (table) => {
        table
          .string("user_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .string("following_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.primary(["user_id", "following_id"]);
      })

      // Create bug table
      .createTable("bugs", (table) => {
        table.increments();
        table
          .string("user_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("users")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("title").notNullable();
        table.text("description").notNullable();
        table.string("photo_url");
        table.boolean("resolved").defaultTo(false);
        table.timestamps(true, true);
      })
  );
};

// eslint-disable-next-line no-unused-vars
exports.down = (knex, Promise) => {
  return knex.schema
    .dropTableIfExists("bugs")
    .dropTableIfExists("following")
    .dropTableIfExists("messages")
    .dropTableIfExists("my_room")
    .dropTableIfExists("posts_to_tags")
    .dropTableIfExists("rooms_to_users")
    .dropTableIfExists("rooms_to_posts")
    .dropTableIfExists("tags")
    .dropTableIfExists("room_to_moderator")
    .dropTableIfExists("rooms")
    .dropTableIfExists("saved_posts")
    .dropTableIfExists("liked_comments")
    .dropTableIfExists("liked_posts")
    .dropTableIfExists("flagged_comments")
    .dropTableIfExists("comments")
    .dropTableIfExists("flagged_posts")
    .dropTableIfExists("posts")
    .dropTableIfExists("user_roles")
    .dropTableIfExists("users")
    .dropTableIfExists("flagged_reason")
    .dropTableIfExists("roles")
    .dropTableIfExists("permissions");
};
