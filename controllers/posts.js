import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  const cat = req.query.cat;
  const query = cat ? { where: { cat } } : {};
  const posts = await prisma.post.findMany({ ...query });

  res.status(200).json({ success: true, message: "All posts", data: posts });
};
export const getPost = async (req, res) => {
  const postId = req.params.id;

  const post = await prisma.post.findFirst({
    where: {
      id: parseInt(postId),
    },
    include: {
      user: true,
    },
  });
  if (!post)
    return res.status(404).json({ message: "Not Found", success: false });
  res.status(200).json({ success: true, message: "All posts", data: post });
};
export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Not authenticated", success: false });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err)
      return res.json(401).json({ message: "Not valid token", success: false });

    const { title, desc, cat, img, date } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        desc,
        img,
        date: new Date(date),
        cat,
        uid: user.id,
      },
    });
  });
  res.json({
    success: true,
    message: "Post Creaated Successfully",
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Not authenticated", success: false });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err)
      return res.json(403).json({ message: "Not valid token", success: false });

    const { title, desc, cat, img } = req.body;
    const post = await prisma.post.update({
      where: {
        id: req.params.id,
        uid: user.id,
      },
      data: {
        title,
        desc,
        img,
        cat,
      },
    });
  });
  res.json({
    success: true,
    message: "Post updated Successfully",
    data: post,
  });
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Not authenticated", success: false });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err)
      return res.json(403).json({ message: "Not valid token", success: false });

    await prisma.post.delete({
      where: {
        id: postId,
        uid: user.id,
      },
    });
  });

  res.json({ success: true, message: "Post Deleted Successfully" });
};
