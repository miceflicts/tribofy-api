import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
// import cors from "cors"; // Removido o import do cors

import userRoute from "./routes/usersRoute.js";
import communityRoute from "./routes/communitiesRoute.js";
import postRoute from "./routes/postsRoute.js";
import categoriesRouter from "./routes/categoriesRoute.js";

const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGOURL = process.env.MONGO_URL;
const url = "https://tribofy-api.onrender.com/api/user/getAllUsers";
const interval = 840000;

// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(",")
//   : ["http://localhost:3000"]; // Fallback para desenvolvimento local

// // Configuração do CORS
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       console.log("Blocked origin:", origin); // Para debugging
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// Usar o cors sem opções permitirá todas as origens
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite todas as origens
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
app.use("/api/posts", postRoute);
app.use("/api/categories", categoriesRouter);
