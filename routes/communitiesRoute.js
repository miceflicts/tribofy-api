import express from "express";
import { create, fetch } from "../controller/communitiesController.js";

console.log("registered");
const communityRoute = express.Router();

communityRoute.post("/create", create);
communityRoute.get("/getAllCommunities", fetch);

export default communityRoute;
