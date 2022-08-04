import express from "express";

import * as urlsService from "../service/urlsService.js";

const router = express.Router();

router.get("/u/:shortenedUrl", async (req, res, next) => {
  try {
    const shortenedUrl = req.params.shortenedUrl;

    const url = await urlsService.getUrlByHash(shortenedUrl);

    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
});

router.get("/urls", async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    const urls = await urlsService.getUrlsByUser(userId);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

router.get("/urls/:urlId", async (req, res, next) => {
  try {
    const urlId = Number(req.params.urlId);
    const userId = Number(req.query.userId);

    const url = await urlsService.getUrl(urlId, userId);

    res.status(200).send(url);
  } catch (error) {
    next(error);
  }
});

router.post("/urls", async (req, res, next) => {
  try {
    const payload = req.body;
    const userId = Number(req.query.userId);

    const urls = await urlsService.saveUrl(userId, payload.url);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

router.post("/urls/:urlId/hit", async (req, res, next) => {
  try {
    const urlId = Number(req.params.urlId);
    const userId = Number(req.query.userId);

    const urls = await urlsService.hitUrl(userId, urlId);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

router.delete("/urls/:urlId", async (req, res, next) => {
  try {
    const urlId = Number(req.params.urlId);
    const userId = Number(req.query.userId);

    const urls = await urlsService.deleteUrl(urlId, userId);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

export default router;
