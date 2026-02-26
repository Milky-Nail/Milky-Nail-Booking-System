import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Milky nail 美甲預約系統後端運行中");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
