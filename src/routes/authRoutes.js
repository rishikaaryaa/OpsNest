import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

//Register a new user endpoint /auth/register
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  const accountEmail = (email || username || "").trim().toLowerCase();
  const rawPassword = (password || "").trim();

  if (!accountEmail || !rawPassword) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!accountEmail.includes("@")) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  if (rawPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  //save the username and an irreversible hashed encrypted password in the database
  //save haridas@gmail.com | asd...jnbdjsh....jhsd..we...cdsf in the database

  //encrypt the password
  const hashedPassword = bcrypt.hashSync(rawPassword, 8);

  try {
    const account = await prisma.account.create({
      data: {
        email: accountEmail,
        passwordHash: hashedPassword,
      },
    });
    //now that we have a user, i want a add their first todo for them
    const defaultEntry = "Hare Krishna :) Add your first entry!";
    await prisma.entry.create({
      data: {
        title: defaultEntry,
        accountId: account.id,
      },
    });

    //create a token
    const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Failed to register account" });
  }
});

router.post("/login", async (req, res) => {
  //we get their email and we look up the password associsted with that email in the database
  //but we get it back and see it's encrypted, which means that we cannot compare it to the one user just used trying to login
  //so what we can do is, is again, one way encrypt the password the user just entered

  const { email, password, username } = req.body;
  const loginEmail = (email || username || "").trim().toLowerCase();
  const rawPassword = (password || "").trim();

  if (!loginEmail || !rawPassword) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  if (!loginEmail.includes("@")) {
    return res.status(400).send({ message: "Please provide a valid email" });
  }

  try {
    const account = await prisma.account.findUnique({
      where: {
        email: loginEmail,
      },
    });
    //If we cannot find a usser associated with that username return out from the function
    if (!account) {
      return res.status(404).send({ message: "Account not found" });
    }

    const passwordIsValid = bcrypt.compareSync(
      rawPassword,
      account.passwordHash,
    );

    //If the password doesnot match return out of the function
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    //then we have a successful autentication
    const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;
