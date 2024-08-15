import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";

const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

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

app.use("/api/user", route);
