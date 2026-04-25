import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { initMQTT, publishMessage } from "./services/mqtt";
dotenv.config();

const app = express();
app.use(express.json());

// connectDB();
initMQTT();

app.get("/", (_, res) => {
  res.send("API running");
});

app.post("/publish", (req, res) => {
  const { topic, message } = req.body;

  publishMessage(topic, message);

  res.send("Message sent");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
