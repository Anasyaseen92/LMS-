import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const rawRedisUrl = process.env.REDIS_URL?.trim();
const fallbackRedisUrl = "redis://127.0.0.1:6379";

const normalizeRedisUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return fallbackRedisUrl;

  if (trimmed.startsWith("redis://") && trimmed.includes(".upstash.io")) {
    return trimmed.replace(/^redis:\/\//, "rediss://");
  }

  return trimmed;
};

const redisUrl = normalizeRedisUrl(rawRedisUrl || fallbackRedisUrl);

let hasLoggedReady = false;

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    return Math.min(times * 500, 5000);
  },
  connectTimeout: 10000,
  commandTimeout: 10000,
  lazyConnect: true,
  keepAlive: 30000,
  ...(redisUrl.startsWith("rediss://") ? { tls: {} } : {}),
});

redis.on("ready", () => {
  if (!hasLoggedReady) {
    hasLoggedReady = true;
    console.log("✅ Redis ready");
  }
});

redis.on("error", (err) => {
  console.error(`❌ Redis connection error: ${err.message}`);
});

redis.on("reconnecting", () => {
  hasLoggedReady = false;
  console.warn("⚠️ Redis reconnecting...");
});

export const connectRedis = async () => {
  if (redis.status === "ready" || redis.status === "connecting") return;
  try {
    await redis.connect();
  } catch (error) {
    console.error("❌ Redis connection failed:", (error as Error).message);
  }
};
