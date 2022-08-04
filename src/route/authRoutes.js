import bcrypt from "bcrypt";
import crypto from "crypto";
import express from "express";

import { PermissionDeniedException } from "../domain/errors/PermissionDeniedException.js";

import { getUserByEmail } from "../data/usersData.js";

const router = express.Router();

export const sessionMiddleware = (req, res, next) => {
  if (req.url.includes("/u/")) return next();

  const sessionToken = req.cookies.session_token;

  const userSession = req.session?.sessions?.[sessionToken];

  if (!userSession) {
    res.cookie("session_token", "");

    throw new PermissionDeniedException();
  }

  req.user = userSession;

  next();
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  req.sessionOptions.maxAge = 2 * 60 * 60 * 1000; // 2 hours

  const user = await getUserByEmail(email);

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new PermissionDeniedException();

  const sessionToken = crypto.randomBytes(12).toString("hex");

  if (!req.session.sessions) {
    req.session.sessions = {};
  }

  req.session.sessions[sessionToken] = { email, password: user.password };

  res.cookie("session_token", sessionToken);

  res.status(204).end();
});

router.post("/logout", (req, res) => {
  const sessionToken = req.cookies.session_token;

  if (req.session.sessions?.[sessionToken]) {
    delete req.session.sessions[sessionToken];
  }

  res.status(204).end();
});

export default router;
