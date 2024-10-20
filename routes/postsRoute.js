import express from "express";
import {
  create,
  fetch,
  update,
  deletePost,
  incrementViews,
} from "../controller/posts/postController.js";

import {
  addComment,
  editComment,
  deleteComment,
} from "../controller/posts/commentsController.js";

import {
  addReply,
  editReply,
  deleteReply,
} from "../controller/posts/repliesController.js";

const postRoute = express.Router();

postRoute.post("/create", create);
postRoute.get("/getPosts", fetch);
postRoute.put("/update/", update);
postRoute.put("/incrementViews/:id", incrementViews);
postRoute.delete("/delete/:id", deletePost);

postRoute.post("/addComment", addComment);
postRoute.put("/editComment", editComment);
postRoute.delete("/deleteComment", deleteComment);

postRoute.post("/addReply", addReply);
postRoute.put("/editReply", editReply);
postRoute.delete("/deleteReply", deleteReply);

export default postRoute;
