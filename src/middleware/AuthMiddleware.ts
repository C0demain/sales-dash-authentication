import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET_KEY || "sales-dash-secret";

  try {
    const credential = jwt.verify(token, secretKey);
    if (credential) {
      req.app.locals.credential = credential;
      return next();
    }
    return res.status(403).json({ message: "Invalid token" });
  } catch (err: any) {
    return res.status(403).json({ message: "Invalid token", error: err.message });
  }
};
