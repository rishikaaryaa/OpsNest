import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  let token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : authHeader;
  token = token.trim();
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });

    if (!account) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
  } catch (dbErr) {
    return res.status(500).json({ message: "Database error" });
  }

  // Use ID, matching how jwt.sign is called in authRoutes
  req.accountId = decoded.id;
  req.userId = decoded.id;
  next();
}
export default authMiddleware;
