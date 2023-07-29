import express from "express";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8800;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth/", authRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/users/", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
