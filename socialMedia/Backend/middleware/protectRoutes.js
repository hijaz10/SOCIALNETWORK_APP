import jwt from "jsonwebtoken";
import 'dotenv/config';

const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies["jwt-App"];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protectRoute;
