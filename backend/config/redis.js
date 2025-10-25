import { createClient } from 'redis';

let redisClient = null;

const connectRedis = async () => {
  if (process.env.REDIS_URL) {
    try {
      const client = createClient({ url: process.env.REDIS_URL });
      client.on('error', (err) => {
        console.error('Redis Client Error', err);
      });

      await client.connect();
      console.log('Redis Connected');

      redisClient = client;
    } catch (error) {
      console.error('Redis connection failed, using in-memory fallback', error);
    }
  } else {
    console.warn('No REDIS_URL provided; skipping Redis connection');
  }
};

const disconnectRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.disconnect();  // or `.quit()` depending on version
      console.log('Redis Disconnected');
    } catch (err) {
      console.warn('Error during Redis disconnection', err);
    }
    redisClient = null;
  }
};

export { redisClient, connectRedis, disconnectRedis };
