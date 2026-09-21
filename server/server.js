const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const landRoutes = require("./routes/landRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/expenses", expenseRoutes);
connectDB();

app.get("/", (req, res) => {
  res.send("FarmersBook API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});