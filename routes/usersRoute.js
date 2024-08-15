import express from "express";

import {
  fetch,
  create,
  update,
  deleteUser,
} from "../controller/usersController.js";

const userRoute = express.Router();

userRoute.post("/create", create);
userRoute.get("/getAllUsers", fetch);
userRoute.put("/update/:id", update);
userRoute.delete("/delete/:id", deleteUser);

export default userRoute;
