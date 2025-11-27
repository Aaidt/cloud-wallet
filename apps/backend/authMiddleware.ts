import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
   namespace Express {
      interface Request {
         user?: string
      }
   }
}

export const authMiddleware = (req: Request, res: Response, next: any) => {
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
      res.status(403).json({
         message: "Missing token"
      });
      return;
   }

   jwt.verify(token, process.env.JWT_SECRET as string, (err, email) => {
      if (err) {
         res.status(403).json({
            message: "Inncorrect credentials", err
         });
         return;
      }

      req.user = email as string;
      next();
   });
}
