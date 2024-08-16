import express from "express";
import {
  create,
  fetch,
  update,
  deleteCommunity,
} from "../controller/communitiesController.js";

const communityRoute = express.Router();

communityRoute.post("/create", create);
communityRoute.get("/getAllCommunities", fetch);
communityRoute.put("/update/:id", update);
communityRoute.delete("/delete/:id", deleteCommunity);

export default communityRoute;
