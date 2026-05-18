import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//Get all todos for a logged-in user
router.get("/", async (req, res) => {
  const entries = await prisma.entry.findMany({
    where: {
      accountId: req.accountId,
    },
  });
  const normalized = entries.map((entry) => ({
    ...entry,
    task: entry.title,
  }));
  res.json(normalized);
});

//Create a new todo for a logged-in user
router.post("/", async (req, res) => {
  const title = req.body.title ?? req.body.task;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const entry = await prisma.entry.create({
    data: {
      title: String(title).trim(),
      accountId: req.accountId,
    },
  });
  res.json({ ...entry, task: entry.title });
});

//Update a todo for a logged-in user
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const entryId = parseInt(id);

  const entry = await prisma.entry.findFirst({
    where: {
      id: entryId,
      accountId: req.accountId,
    },
  });

  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  const updatedEntry = await prisma.entry.update({
    where: {
      id: entryId,
    },
    data: {
      completed: !!completed,
    },
  });

  res.json({ updatedEntry, task: updatedEntry.title });
});

//Delete a todo for a logged-in user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const accountId = req.accountId;
  await prisma.entry.deleteMany({
    where: {
      id: parseInt(id),
      accountId,
    },
  });
  res.json({ message: "Entry deleted" });
});

export default router;
