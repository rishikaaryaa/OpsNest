import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.accountId },
      select: { id: true, email: true },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const entries = await prisma.entry.findMany({
      where: { accountId: req.accountId },
      orderBy: { id: "desc" },
    });

    const contactSubmissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      account,
      entries: entries.map((entry) => ({ ...entry, task: entry.title })),
      contactSubmissions,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

export default router;
