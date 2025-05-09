import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Start server
(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
