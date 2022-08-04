import crypto from "crypto";

import { prisma } from "../infra/database/client.js";

const createHash = () => {
  const baseHash = crypto.randomBytes(4).toString("hex");

  const salt = crypto.randomBytes(2).toString("hex");

  const hash = crypto
    .createHash("md5")
    .update(`${salt}${baseHash}`, "utf8")
    .digest("base64url");

  return hash.substring(0, 12);
};

export const getUrlsByUser = (userId) => {
  return prisma.url.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: true,
    },
  });
};

export const getUrl = (urlId) => {
  return prisma.url.findUnique({
    where: {
      id: urlId,
    },
    include: {
      author: true,
    },
  });
};

export const getUrlByHash = (hash) => {
  return prisma.url.findUnique({
    where: {
      shortenedUrl: hash,
    },
    include: {
      author: true,
    },
  });
};

export const saveUrl = (userId, url) => {
  const hash = createHash();

  return prisma.url.create({
    data: {
      originalUrl: url,
      shortenedUrl: hash,
      authorId: userId,
    },
  });
};

export const updateUrl = (urlId, payload) => {
  return prisma.url.update({
    where: {
      id: urlId,
    },
    data: {
      ...payload,
    },
  });
};

export const deleteUrl = (urlId) => {
  return prisma.url.delete({
    where: {
      id: urlId,
    },
  });
};
