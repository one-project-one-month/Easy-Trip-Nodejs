// redis.js
import Redis from 'ioredis';
import ENV from './custom-env';

export const redisClient = new Redis(ENV.REDIS_URI as string);