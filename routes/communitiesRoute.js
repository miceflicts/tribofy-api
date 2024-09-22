import express from "express";
import {
  create,
  fetch,
  update,
  deleteCommunity,
  checkIfCommunityExists,
} from "../controller/communitiesController.js";

const communityRoute = express.Router();

communityRoute.post("/create", create);
communityRoute.post("/checkIfCommunityExists", checkIfCommunityExists);
communityRoute.get("/fetchCommunities", fetch);
communityRoute.put("/update/:id", update);
communityRoute.delete("/delete/:id", deleteCommunity);

export default communityRoute;
