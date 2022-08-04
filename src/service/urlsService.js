import * as urlsData from "../data/urlsData.js";
import * as urlsCache from "../data/urlsCache.js";

import { PermissionDeniedException } from "../domain/errors/PermissionDeniedException.js";
import { ResourceNotFoundException } from "../domain/errors/ResourceNotFoundException.js";

export const getUrlByHash = async (hash) => {
  // TODO: Cleanup from cache Urls not been hit in a while
  const cache = urlsCache.urlsByKeyCache("hash");

  const cachedUrls = await cache.get();

  const cachedUrl = cachedUrls.find((url) => url.shortenedUrl === hash);

  if (cachedUrl) return cachedUrl;

  const url = await urlsData.getUrlByHash(hash);

  if (!url.originalUrl) throw new ResourceNotFoundException();

  cachedUrls.push(url);

  await cache.save(cachedUrls);

  return url;
};

export const getUrlsByUser = async (userId) => {
  const cache = urlsCache.urlsByKeyCache(userId);

  const cachedUrls = await cache.get();

  if (cachedUrls) return cachedUrls;

  const urls = await urlsData.getUrlsByUser(userId);

  if (!urls || urls.length < 1) throw new ResourceNotFoundException();

  await cache.save(urls);

  return urls;
};

export const getUrl = async (urlId, userId) => {
  const url = await urlsData.getUrl(urlId);

  if (!url) throw new ResourceNotFoundException();

  if (url.authorId !== userId) throw new PermissionDeniedException();

  return url;
};

export const saveUrl = async (userId, url) => {
  const newUrl = await urlsData.saveUrl(userId, url);

  const cache = urlsCache.urlsByKeyCache(userId);

  cache.doExpireByKey();

  return newUrl;
};

export const hitUrl = async (urlId, userId) => {
  const url = await urlsData.getUrl(urlId);

  if (url.authorId !== userId) throw new PermissionDeniedException();

  const payload = {
    ...url,
    lastTimeSeen: new Date(),
    timesHit: url.timesHit++,
  };

  const newUrl = await urlsData.updateUrl(urlId, payload);

  return newUrl;
};

export const deleteUrl = async (urlId, userId) => {
  const urlInfo = await urlsData.getUrl(urlId);

  if (urlInfo.authorId !== userId) throw new PermissionDeniedException();

  const newUrl = await urlsData.deleteUrl(urlId, userId);

  const cacheByUser = urlsCache.urlsByKeyCache(userId);
  cacheByUser.doExpireByKey();

  const cacheByHash = urlsCache.urlsByKeyCache("hash");
  cacheByHash.doExpireByKey();

  return newUrl;
};
