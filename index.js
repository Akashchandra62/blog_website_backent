import express from "express";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8800;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json({ filename: file.filename });
});

app.use("/api/auth/", authRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/users/", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
