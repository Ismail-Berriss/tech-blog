import express from "express";
import env from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

env.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/message/", (req, res) => {
  res.json("SOMETHING");
});

app.listen(port, () => {
  console.log(`Server port is running on ${port}`);
});
