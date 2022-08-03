import express from "express";

import * as usersService from "../service/usersService.js";

const router = express.Router();

router.get("/users", async (req, res, next) => {
  try {
    const users = await usersService.getUsers();

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const user = await usersService.getUser(id);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  try {
    const payload = req.body;

    const user = await usersService.saveUser(payload);

    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", async (req, res, next) => {
  try {
    const payload = req.body;
    const id = Number(req.params.id);

    const user = await usersService.updateUser(id, payload);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const user = await usersService.deleteUser(id);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

export default router;
