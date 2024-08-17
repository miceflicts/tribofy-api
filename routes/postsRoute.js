import express from "express";
import {
  create,
  fetch,
  update,
  deletePost,
  incrementViews,
} from "../controller/postsController.js";

const postRoute = express.Router();

postRoute.post("/create", create);
postRoute.get("/getAllPosts", fetch);
postRoute.put("/update/", update);
postRoute.put("/incrementViews/:id", incrementViews);
postRoute.delete("/delete/:id", deletePost);

export default postRoute;
