import express from "express";

import {
  fetch,
  create,
  update,
  deleteUser,
  login,
  isInCommunity,
  joinCommunity,
} from "../controller/usersController.js";

const userRoute = express.Router();

userRoute.get("/getAllUsers", fetch);
userRoute.get("/isInCommunity", isInCommunity);

userRoute.put("/update/:id", update);

userRoute.post("/create", create);
userRoute.post("/login", login);
userRoute.post("/joinCommunity", joinCommunity);

userRoute.delete("/delete/:id", deleteUser);

export default userRoute;
