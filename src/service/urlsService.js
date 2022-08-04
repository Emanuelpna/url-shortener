import * as urlsData from "../data/urlsData.js";
import * as urlsCache from "../data/urlsCache.js";

import * as usersData from "../data/usersData.js";

import { PermissionDeniedException } from "../domain/errors/PermissionDeniedException.js";
import { ResourceNotFoundException } from "../domain/errors/ResourceNotFoundException.js";

export const getUrlByHash = async (hash) => {
  const cache = urlsCache.urlsByKeyCache("hash");

  const cachedUrls = (await cache.get()) ?? [];

  const cachedUrl = cachedUrls?.find((url) => url.shortenedUrl === hash);

  if (cachedUrl) return cachedUrl;

  const url = await urlsData.getUrlByHash(hash);

  if (!url) throw new ResourceNotFoundException();

  if (!url.originalUrl) throw new ResourceNotFoundException();

  cachedUrls?.push(url);

  await cache.save(cachedUrls);

  return url;
};

export const getUrlsByUser = async (user) => {
  const userData = await usersData.getUserByEmail(user.email);

  const cache = urlsCache.urlsByKeyCache(userData.id);

  const cachedUrls = await cache.get();

  if (cachedUrls) return cachedUrls;

  const urls = await urlsData.getUrlsByUser(userData.id);

  await cache.save(urls);

  return urls;
};

export const getUrl = async (urlId, user) => {
  const userData = await usersData.getUserByEmail(user.email);

  const url = await urlsData.getUrl(urlId);

  if (!url) throw new ResourceNotFoundException();

  if (url.authorId !== userData.id) throw new PermissionDeniedException();

  return url;
};

export const saveUrl = async (user, url) => {
  const userData = await usersData.getUserByEmail(user.email);

  const newUrl = await urlsData.saveUrl(userData.id, url);

  const cache = urlsCache.urlsByKeyCache(userData.id);

  cache.doExpireByKey();

  return newUrl;
};

export const hitUrl = async (urlId, user) => {
  const userData = await usersData.getUserByEmail(user.email);

  const url = await urlsData.getUrl(urlId);

  if (url.authorId !== userData.id) throw new PermissionDeniedException();

  const payload = {
    ...url,
    lastTimeSeen: new Date(),
    timesHit: url.timesHit++,
  };

  const newUrl = await urlsData.updateUrl(urlId, payload);

  return newUrl;
};

export const deleteUrl = async (urlId, user) => {
  const userData = await usersData.getUserByEmail(user.email);

  const urlInfo = await urlsData.getUrl(urlId);

  if (urlInfo.authorId !== userData.id) throw new PermissionDeniedException();

  const newUrl = await urlsData.deleteUrl(urlId, userData.id);

  const cacheByUser = urlsCache.urlsByKeyCache(userData.id);
  cacheByUser.doExpireByKey();

  const cacheByHash = urlsCache.urlsByKeyCache("hash");
  cacheByHash.doExpireByKey();

  return newUrl;
};
