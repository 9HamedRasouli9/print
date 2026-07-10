import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-in-production");
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    return next(error);
  }
}
