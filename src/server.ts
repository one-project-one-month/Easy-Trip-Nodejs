import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import router from "./routes";
import ENV from "./config/custom-env";

const app = express();
const port = ENV.PORT;

app.use(cors());
app.use(express.json());
app.use('/api', router);

// Start server
(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`${ENV.APP_NAME} is running on port ${port}`);
  });
})();
