import express from "express";

import {
  fetch,
  create,
  update,
  deleteUser,
  login,
} from "../controller/usersController.js";

const userRoute = express.Router();

userRoute.post("/create", create);
userRoute.get("/getAllUsers", fetch);
userRoute.put("/update/:id", update);
userRoute.put("/login", login);
userRoute.delete("/delete/:id", deleteUser);

export default userRoute;
