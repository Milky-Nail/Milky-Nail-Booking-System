BigInt.prototype.toJSON = function () {
  return this.toString();
};

import express from "express";
import cors from "cors";
import rootRouter from "./src/routes/index";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
