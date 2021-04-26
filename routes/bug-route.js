const express = require("express");
const Bug = require("../models/bugs");
const app = express.Router();
const { cloudinary } = require("../config/cloudinary");

app.get("/", async (request, response) => {
  try {
    const bugs = await Bug.fetchBugs();
    response.status(200).json(bugs);
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.get("/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const bug = await Bug.fetchBug(id);
    response.status(200).json(bug);
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.post("/", async (request, response) => {
  const value = request.body;

  try {
    const newBug = await Bug.addBug(value);
    response.status(200).json(newBug);
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.put("/:id", async (request, response) => {
  const id = request.params.id;
  const value = request.body;

  try {
    const bug = await Bug.fetchBug(id);
    if (bug.id) {
      const editedBug = await Bug.updateBug(id, value);
      response.status(200).json(editedBug);
    } else {
      response.status(404).json({ message: "Bug not found" });
    }
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.get("/resolve/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const bug = await Bug.fetchBug(id);
    if (bug.id) {
      const resovledBug = await Bug.resolveBug(id);
      response.status(200).json(resovledBug);
    } else {
      response.status(404).json({ message: "Bug not found" });
    }
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.get("/open/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const bug = await Bug.fetchBug(id);
    if (bug.id) {
      const openedBug = await Bug.openBug(id);
      response.status(200).json(openedBug);
    } else {
      response.status(404).json({ message: "Bug not found" });
    }
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.delete("/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const bug = await Bug.fetchBug(id);
    if (bug.id) {
      const deletedBug = await Bug.removeBug(id);
      response.status(200).json(deletedBug);
    } else {
      response.status(404).json({ message: "Bug not found" });
    }
  } catch (err) {
    return response.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.post("/image", async (request, response) => {
  try {
    const fileStr = request.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    response.status(200).json({ url: uploadResponse.secure_url });
  } catch (err) {
    response.status(500).json({ err: "Failed to upload image" });
  }
});

module.exports = app;
