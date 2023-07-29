import express from "express";

const app = express();
const PORT = process.env.PORT || 8800;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
