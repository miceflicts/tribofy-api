import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import userRoute from "./routes/usersRoute.js";
import communityRoute from "./routes/communitiesRoute.js";

const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGOURL = process.env.MONGO_URL;
const url = "https://tribofy-api.onrender.com/api/user/getAllUsers";
const interval = 840000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

setInterval(reloadWebsite, interval);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRoute);
app.use("/api/communities", communityRoute);
