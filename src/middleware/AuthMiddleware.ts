import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.role;

    if (
      !userRoles ||
      !userRoles.some((role: string) => allowedRoles.includes(role))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
