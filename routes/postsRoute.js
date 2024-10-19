import express from "express";
import {
  create,
  fetch,
  update,
  deletePost,
  incrementViews,
  addComment,
  editComment,
  deleteComment,
} from "../controller/postsController.js";

const postRoute = express.Router();

postRoute.post("/create", create);
postRoute.get("/getPosts", fetch);
postRoute.put("/update/", update);
postRoute.put("/incrementViews/:id", incrementViews);
postRoute.delete("/delete/:id", deletePost);

postRoute.post("/addComment", addComment);
postRoute.put("/editComment", editComment);
postRoute.delete("/deleteComment/:postId/:commentId", deleteComment);

export default postRoute;
