import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.KEY;

if (!jwtKey) {
  throw new Error(" Missing CLERK_JWT_KEY in environment.");
}

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, { jwtKey });

    req.userId = payload.sub;       // Clerk User ID
    req.sessionId = payload.sid;    // Clerk Session ID 

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
