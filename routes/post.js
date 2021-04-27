const express = require("express");
const Post = require("../models/post");

const app = express.Router();

const { findIfPostLiked } = require("../middleware");

// Create post
app.post("/create", (request, response) => {
  const userID = request.user.id;
  const { title, description, room_id } = request.body;

  Post.createPost({ user_id: userID, title, description })
    .then(([res]) => {
      Post.createRoomPostEntry(res, room_id)
        .then(() => {
          response.status(200).json({ message: "Post created successfully" });
        })
        .catch((err) => {
          console.log(err);
          response.status(500).json({ message: "Error creating post" });
        });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: "Error creating post" });
    });
});

//Delete a post
app.delete("/delete/:postID", (request, response) => {
  const postID = request.params.postID;
  Post.deletePost(postID)
    .then(() => {
      response.status(200).json({ message: "Post archived" });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({ message: "Error archiving post" });
    });
});



// Fetch posts ordered by most recent
app.get("/recent", (request, response) => {
  Post.fetchRecent()
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: "Error fetching recent posts" });
    });
});
//Fetch post by recent liked post
app.get("/recentliked/", (request, response) => {
  Post.fetchRecentLiked()
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: "Error fetching recent liked posts" });
    });
});

// Fetch posts ordered by most popular
app.get("/popular", (request, response) => {
  Post.fetchPopular()
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: "Error fetching popular posts" });
    });
});

// Search for a post based on user search input
app.post("/search", (request, response) => {
  const search = request.body.search;
  Post.fetchSearch(search)
    .then((res) => response.status(200).json(res))
    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: "Error fetching posts" });
    });
});

// Like a post
app.get("/like/:id", findIfPostLiked, (request, response) => {
  const userID = request.user.id;
  const postID = request.params.id;
  const pair = request.body.pair;
  
  if (!pair) {
    Post.incrementPostLikes(postID)
      .then(() => {
        Post.addPostLike(userID, postID)
          .then(() =>
            response.status(200).json({
              message: "Post liked successfully",
            })
          )
          .catch((err) => {
            console.log(err);
            response.status(500).json({
              message: "Error adding post like",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({
          message: "Error incrementing post's comment count",
        });
      });
  } else {
    response.status(400).json({
      message: "Ooops, already liked that post.",
    });
  }
});

// Remove like from a post
app.delete("/like/:id", findIfPostLiked, (request, response) => {
  const userID = request.user.id;
  const postID = request.params.id;
  const pair = request.body.pair;
  if (pair) {
    Post.decrementPostLikes(postID)
      .then(() => {
        Post.removePostLike(userID, postID)
          .then(() =>
            response.status(200).json({
              message: "Post unliked successfully",
            })
          )
          .catch((err) => {
            console.log(err);
            response.status(500).json({
              message: "Error removing post like",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        response.status(500).json({
          message: "Error decrementing post's comment count",
        });
      });
  } else {
    response.status(400).json({
      message: "Ooops, haven't liked that post.",
    });
  }
});

//Update a post must be the user that created post
app.put("/update/:userID/:postID", (request, response) => {
  const postID = request.params.postID;
  const userID = request.params.userID;
  const { newDescription } = request.body;

  if (userID !== request.user.id) {
    response.status(401).json({ message: "unathorized user" });
  } else {
    Post.postUpdate(postID, newDescription)
      .then((data) => response.status(200).json(data))
      .catch((err) => {
        response.status(500).json(err);
      });
  }
});
// Fetch a single post
app.get("/:id", (request, response) => {
  const postID = request.params.id;
  Post.fetch(postID)
    .then((post) => response.status(200).json(post))
    .catch((error) => {
      console.log(error);
      response.status(500).json({
        message: "Error fetching individual post",
      });
    });
});

module.exports = app;
