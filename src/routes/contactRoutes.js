import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

function getOptionalAccountId(req) {
  const authHeader = req.headers.authorization || "";
  let token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : authHeader;
  token = token.trim();
  if (!token) {
    return null;
  }
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.id ?? null;
  } catch {
    return null;
  }
}

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanMessage = (message || "").trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required" });
  }

  if (!cleanEmail.includes("@")) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  try {
    const accountId = getOptionalAccountId(req);
    const submission = await prisma.contactSubmission.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        accountId,
      },
    });
    res.status(201).json(submission);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(submissions);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

export default router;
