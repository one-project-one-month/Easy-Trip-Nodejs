import "./config/dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import router from "./routes";
import ENV from "./config/custom-env";
import passport from "passport";
import "./config/passport";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
const port = ENV.PORT;

const corsConfig = {
  origin: [ENV.CORS_ALLOWED_URL1 as string, ENV.CORS_ALLOWED_URL2 as string],
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use("/api", router);

// Start server
(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`${ENV.APP_NAME} is running on port ${port}`);
  });
})();
