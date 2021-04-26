// eslint-disable-next-line no-unused-vars
const database = require("../database/dbConfig");

// Create a room
const add = (room) => {
  return database("rooms").insert(room).returning("*");
};

//Create Private Room
const addPrivateRoom = async (room) => {
  return database("rooms")
    .insert({
      room_name: room.room_name,
      description: room.description,
      private: true,
    })
    .returning("*");
};

//Add User to a private room
const addUserPrivateRoom = async (roomId, userId) => {
  return database("rooms_to_users")
    .insert({
      room_id: roomId,
      user_id: userId,
    })
    .returning("*");
};

//Remove Users from a private room
const removeUserPrivateRoom = async (roomId, userId) => {
  return database("rooms_to_users")
    .where("room_id", roomId)
    .andWhere("user_id", userId)
    .del();
};

// Delete a room
const remove = (roomId) => {
  return database("rooms").where("id", roomId).del();
};

// Fetch all rooms
const getAllRooms = () => {
  return database("rooms").orderBy("room_name");
};

const getAllPrivateRooms = async () => {
  const privateRooms = await database("rooms").where("rooms.private", true);

  const privRoomsUsers = privateRooms.map(async (room) => {
    const users = await database("rooms")
      .join("rooms_to_users", "rooms.id", "rooms_to_users.room_id")
      .join("users", "rooms_to_users.user_id", "users.id")
      .select([
        "users.id",
        "users.display_name",
        "users.profile_picture",
        "users.track",
        "users.email",
        "users.role_id",
      ])
      .where("rooms.id", room.id)
      .orderBy("room_name");

    return { ...room, users };
  });

  const result = await Promise.all(privRoomsUsers);

  return result;
};

const getPrivateRoom = async (roomId) => {
  const privateRoom = await database("rooms").where("rooms.id", roomId).first();

  const users = await database("rooms_to_users")
    .join("users", "rooms_to_users.user_id", "users.id")
    .select([
      "users.id",
      "users.display_name",
      "users.profile_picture",
      "users.track",
      "users.email",
      "users.role_id",
    ])
    .where("rooms_to_users.room_id", roomId);

  return { ...privateRoom, users };
};

// Fetch a room by filter
const getRoomBy = (filter) => {
  return database("rooms").where(filter).first();
};

// Fetch all posts in a room ordered by most recent
const fetchRecentByRoomId = async (room_id, page, limit, user_id) => {
  const posts = await database("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .join("rooms_to_posts as rtp", "p.id", "rtp.post_id")
    .orderBy("p.created_at", "desc")
    .limit(limit)
    .offset((page - 1) * limit)
    .select([
      "p.id",
      "p.visible",
      "u.id as user_id",
      "u.profile_picture",
      "u.display_name",
      "p.title",
      "p.description",
      "p.likes",
      "p.comments",
      "p.created_at",
      "p.updated_at",
    ])
    .where("rtp.room_id", room_id)
    .andWhere("p.visible", 1);

  const count = await database("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .join("rooms_to_posts as rtp", "p.id", "rtp.post_id")
    .where("rtp.room_id", room_id)
    .andWhere("p.visible", 1)
    .count("p.id");

  const userLikes = (
    await database("liked_posts as lp")
      .select("lp.post_id")
      .where("lp.user_id", user_id)
  ).map((item) => item.post_id);

  return {
    posts: posts.map((post) => {
      return { ...post, liked: userLikes.includes(post.id) };
    }),
    totalPages: Math.ceil(count[0].count / limit),
  };
};

// Fetch all posts in a room ordered by likes
const fetchPopularByRoomId = async (room_id, page, limit) => {
  const posts = await database("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .join("rooms_to_posts as rtp", "p.id", "rtp.post_id")
    .orderBy("p.likes", "desc")
    .select([
      "p.id",
      "u.id as user_id",
      "u.profile_picture",
      "u.display_name",
      "p.title",
      "p.description",
      "p.likes",
      "p.comments",
      "p.created_at",
      "p.updated_at",
    ])
    .limit(limit)
    .offset((page - 1) * limit)
    .where("rtp.room_id", room_id)
    .andWhere("p.visible", 1);
  const count = await database("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .join("rooms_to_posts as rtp", "p.id", "rtp.post_id")
    .where("rtp.room_id", room_id)
    .andWhere("p.visible", 1)
    .count("p.id");
  return {
    posts: posts,
    totalPages: Math.ceil(count[0].count / limit),
  };
};

// Fetch posts in a room based on user search input
const searchWithRoomId = (room_id, search) => {
  return database("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .join("rooms_to_posts as rtp", "p.id", "rtp.post_id")
    .whereRaw("LOWER(p.title) LIKE ?", [`%${search}%`])
    .orWhereRaw("LOWER(p.description) LIKE ?", [`%${search}%`])
    .select([
      "p.id",
      "u.id as user_id",
      "u.profile_picture",
      "u.display_name",
      "p.title",
      "p.description",
      "p.likes",
      "p.comments",
      "p.created_at",
      "p.updated_at",
    ])
    .where("rtp.room_id", room_id)
    .andWhere("p.visible", 1);
};

module.exports = {
  add,
  addPrivateRoom,
  addUserPrivateRoom,
  removeUserPrivateRoom,
  remove,
  getAllRooms,
  getAllPrivateRooms,
  getPrivateRoom,
  getRoomBy,
  fetchRecentByRoomId,
  fetchPopularByRoomId,
  searchWithRoomId,
};
