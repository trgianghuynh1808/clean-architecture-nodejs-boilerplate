import { castBoolean } from '@storkyle/shared/utilities';
import { RedisClientOptions, RedisClientType, RedisModules, createClient } from 'redis';

// *INFO: internal modules
import { logger } from '@shared/helpers';

const configConnection: RedisClientOptions<
  RedisModules,
  Record<string, never>,
  Record<string, never>
> = {
  socket: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? '6379'),
  },
};

class _RedisProvider {
  private _redisClient: RedisClientType;

  public async initConnection() {
    logger.info('---> Redis connecting');
    this._redisClient = createClient(configConnection);

    this._redisClient.on('error', (err) => {
      logger.error(err, 'Redis error');
    });
    this._redisClient.on('connect', () => logger.info('---> Redis connected'));
    this._redisClient.on('ready', () => logger.info('---> Redis ready'));
    this._redisClient.on('reconnecting', () => logger.info('Redis reconnecting'));
    this._redisClient.on('end', () => logger.info('Redis end'));

    await this._redisClient.connect();
  }

  get redisClient() {
    return this._redisClient;
  }

  /**
   *
   * @param key
   * @param value
   * @param expire_after - unit in seconds, default is 60 seconds. If 0, it will never expire
   * @returns
   */
  public async set<T = any>(
    key: string,
    value: T,
    expire_after: number = 60
  ): Promise<string | null> {
    return this._redisClient.set(key, JSON.stringify(value), {
      EX: expire_after > 0 ? expire_after : undefined,
    });
  }

  public async get<T = string | null>(key: string): Promise<T> {
    const r = await this._redisClient.get(key);
    return r ? JSON.parse(r) : null;
  }

  public async delete(key: string): Promise<boolean> {
    const r = await this._redisClient.del(key);
    return castBoolean(r);
  }
}

export const RedisProvider = new _RedisProvider();
