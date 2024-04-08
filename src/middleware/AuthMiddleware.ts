import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.headers.authorization) {
    return res.status(401).send("No token!");
  }

  let secretKey = process.env.JWT_SECRET_KEY || "secret";
  const token: string = req.headers.authorization.split(" ")[1];

  try {
    const credential = jwt.verify(token, secretKey) as JwtPayload;

    const { userId, email, role } = credential;

    req.user = { id: userId, email: email, role };

    if (credential) {
      req.app.locals.credential = credential;
      return next();
    }
    return res.send("token invalid");
  } catch (err) {
    return res.send(err);
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
