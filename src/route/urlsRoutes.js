import express from "express";

import * as urlsService from "../service/urlsService.js";

const router = express.Router();

router.get("/u/:shortenedUrl", async (req, res, next) => {
  try {
    const shortenedUrl = req.params.shortenedUrl;

    const url = await urlsService.getUrlByHash(shortenedUrl);

    await urlsService.hitUrl(url.id);

    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
});

router.get("/urls", async (req, res, next) => {
  try {
    const urls = await urlsService.getUrlsByUser(req.user);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

router.get("/urls/:urlId", async (req, res, next) => {
  try {
    const urlId = Number(req.params.urlId);

    const url = await urlsService.getUrl(urlId, req.user);

    res.status(200).send(url);
  } catch (error) {
    next(error);
  }
});

router.post("/urls", async (req, res, next) => {
  try {
    const payload = req.body;

    const urls = await urlsService.saveUrl(req.user, payload.url);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

router.post("/urls/:urlId/hit", async (req, res, next) => {
  try {
    const urlId = Number(req.params.urlId);

    const urls = await urlsService.hitUrl(urlId);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

router.delete("/urls/:urlId", async (req, res, next) => {
  try {
    const urlId = Number(req.params.urlId);

    const urls = await urlsService.deleteUrl(urlId, req.user);

    res.status(200).send(urls);
  } catch (error) {
    next(error);
  }
});

export default router;
