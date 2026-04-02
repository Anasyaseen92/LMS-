import { redis } from "./redis";

export const isRedisConnected = (): boolean => {
  return redis.status === "ready";
};

export const waitForRedisConnection = async (timeoutMs = 5000): Promise<boolean> => {
  if (redis.status === "ready") {
    return true;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      redis.off("ready", onReady);
      resolve(false);
    }, timeoutMs);

    const onReady = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    redis.once("ready", onReady);
  });
};

export const safeRedisGet = async (key: string): Promise<string | null> => {
  try {
    if (!isRedisConnected()) {
      console.warn("Redis not connected, skipping cache read for key:", key);
      return null;
    }
    return await redis.get(key);
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
};

export const safeRedisSet = async (key: string, value: string, expireSeconds?: number): Promise<boolean> => {
  try {
    if (!isRedisConnected()) {
      console.warn("Redis not connected, skipping cache write for key:", key);
      return false;
    }
    
    if (expireSeconds) {
      await redis.setex(key, expireSeconds, value);
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch (error) {
    console.error("Redis set error:", error);
    return false;
  }
};