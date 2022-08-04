import dotenv from "dotenv";
import crypto from "crypto";
import express from "express";
import { Prisma } from "@prisma/client";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

import { FieldIsNotUniqueException } from "./domain/errors/FieldIsNotUniqueException.js";
import { PermissionDeniedException } from "./domain/errors/PermissionDeniedException.js";
import { ResourceNotFoundException } from "./domain/errors/ResourceNotFoundException.js";

import urlsRoutes from "./route/urlsRoutes.js";
import usersRoutes from "./route/usersRoutes.js";
import authRoutes, { sessionMiddleware } from "./route/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: process.env.SESSION_KEYS
      ? JSON.parse(process.env.SESSION_KEYS)
      : ["6ca4e704d582c2", "749ea55fb82c9a"],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS
  })
);

app.get("/", (req, res) => {
  res.send({
    message: "Hello World",
    userSession: req.user,
    processEnv: process.env,
    sessions: req.session.sessions,
    sessionToken: req.cookies.session_token,
  });
});

app.use("/", authRoutes);
app.use("/", sessionMiddleware, urlsRoutes);
app.use("/", sessionMiddleware, usersRoutes);

// Must be the last one `app.use` on this file. And must have the 4 args in order to be used as intended by express
app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const errorMessage = new FieldIsNotUniqueException();
      return res.status(422).send({ message: errorMessage.message });
    } else if (error.code.charAt(1) === 2) {
      return res.status(422).send({
        message: "Confira os campos enviados e tente novamente mais tarde",
      });
    }
  }

  if (error instanceof ResourceNotFoundException) {
    return res.status(404).send({
      message: error.message,
    });
  }

  if (error instanceof FieldIsNotUniqueException) {
    return res.status(422).send({
      message: error.message,
    });
  }

  if (error instanceof PermissionDeniedException) {
    return res.status(403).send({
      message: error.message,
    });
  }

  res.status(500).send({ message: "Um problema desconhecido ocorreu" });
});

app.listen(process.env.PORT ?? "3000", () => {
  console.log(`Server is listening to Port ${process.env.PORT}`);
});
