import { redisClient } from '../config/redis.js';

/**
 * Blacklist a token by storing its JTI with TTL = token expiration time
 */
export const blacklistToken = async (jti, exp) => {
  const nowSec = Math.floor(Date.now() / 1000);
  const ttl = exp - nowSec;

  if (ttl <= 0) {
    console.warn(`Token ${jti} already expired — skipping blacklist`);
    return;
  }

  if (!redisClient?.isReady) {
    throw new Error('Redis client not connected');
  }

  try {
    // Store blacklist entry with expiration
    await redisClient.set(`auth:blacklist:${jti}`, 'revoked', { EX: ttl });
    console.log(`Token ${jti} blacklisted for ${ttl}s`);
  } catch (err) {
    console.error('Failed to blacklist token in Redis:', err);
    throw err;
  }
};

/**
 * Check if a token's JTI is blacklisted
 */
export const isTokenBlacklisted = async (jti) => {
  if (!redisClient?.isReady) {
    throw new Error('Redis client not connected');
  }

  try {
    const exists = await redisClient.exists(`blacklist:${jti}`);
    return exists === 1;
  } catch (err) {
    console.error('Error checking Redis blacklist:', err);
    throw err;
  }
};
