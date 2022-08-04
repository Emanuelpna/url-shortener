import { redis } from "../infra/database/cache.js";

export const urlsByKeyCache = (key) => {
  const baseKey = "urls:byKey";

  const cacheKey = `${baseKey}:${key}`;

  return {
    async get() {
      const cachedUrls = await redis.get(cacheKey);

      return JSON.parse(cachedUrls);
    },
    async save(urls) {
      await redis.set(cacheKey, JSON.stringify(urls));
    },
    async doExpireByKey() {
      await redis.del(cacheKey);
    },
    async doExpireAll() {
      await deleteKeysByPattern(`${baseKey}:*`);
    },
  };
};

function deleteKeysByPattern(keyPattern) {
  // https://github.com/redis/node-redis/issues/1314#issuecomment-370488211

  return new Promise((resolve, reject) => {
    const stream = redis.scanStream({
      match: keyPattern,
      count: 100,
    });

    let keys = [];

    stream.on("data", (resultKeys) => {
      for (const key of resultKeys) {
        keys.push(key);
      }
    });

    stream.on("error", (error) => {
      reject(error);
    });

    stream.on("end", () => {
      redis.unlink(keys);
      resolve();
    });
  });
}
