import jwt from "jsonwebtoken";
import 'dotenv/config';

function generateTokenAndSetCookie(userId, res) {
  const node_env = process.env.NODE_ENV;
  const JWT_SECRET = process.env.JWT_SECRET;

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt-App", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    sameSite: "strict",
    secure: node_env !== "development",
  });

  return token;
}

export { generateTokenAndSetCookie };
