import express from "express"
import cors from "cors"
import { prismaClient } from "db/client"
import z from "zod";
import { authMiddleware } from "./authMiddleware";
import jwt from "jsonwebtoken"
import { userSchema } from "common";
import { da } from "zod/v4/locales";

const app = express();
app.use(cors())
app.use(express.json())
app.use(authMiddleware)

app.get("/signin", async (req, res) => {
   const { success, data } = z.safeParse(userSchema, req.body);
   if (!success) {
      res.status(403).json({ message: "user is not authourized" });
      return;
   }

   try {
      const realUser = await prismaClient.user.findFirst({
         where: { email: data?.email }
      });
      if (!realUser) {
         res.status(404).json({ message: "Invalid credentials" });
         return;
      }
      const token = jwt.sign({
         email: data.email
      }, process.env.JWT_SECRET as string);

      res.status(200).json({ token })

   } catch (err) {
      res.status(403).json({ message: "Err in reading user from data" });
   }

});

app.get("/calendar", authMiddleware, (req, res) => {

})

app.listen(process.env.PORT || 3000, () => {
   console.log("Server is running on port 3000");
});
