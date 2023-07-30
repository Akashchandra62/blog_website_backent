import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Prisma = new PrismaClient();

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //CHECK USER EXIST OR NOT
    const isExist = await Prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (isExist)
      return res
        .status(409)
        .json({ success: false, message: "User already Exists" });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = await Prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        img: "",
      },
    });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    return res.json({ err: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "All Fields are required" });

  const user = await Prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user)
    return res.status(404).json({ success: false, message: "User Not Found" });

  //CHECK PASSWORD
  const isValid = bcrypt.compare(password, user.password);
  if (!isValid)
    return res
      .status(400)
      .json({ success: false, message: "Wrong Credentials! Check again" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  const { password: UserPassword, ...other } = user;
  res.cookie("access_token", token);
  res.status(200).json({
    success: true,
    message: "Logged In Successfully",
    data: other,
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).json("User has been logged out");
};
