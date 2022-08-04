import dotenv from "dotenv";
import express from "express";
import { Prisma } from "@prisma/client";

import { FieldIsNotUniqueException } from "./domain/errors/FieldIsNotUniqueException.js";
import { PermissionDeniedException } from "./domain/errors/PermissionDeniedException.js";
import { ResourceNotFoundException } from "./domain/errors/ResourceNotFoundException.js";

import urlsRoutes from "./route/urlsRoutes.js";
import usersRoutes from "./route/usersRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// TODO: Add Cookie bases User Authentication

app.get("/", (req, res) => {
  res.send({
    message: "Hello World",
  });
});

app.use("/", urlsRoutes);
app.use("/", usersRoutes);

// Must be the last one `app.use` on this file
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
