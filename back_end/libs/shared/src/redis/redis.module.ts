import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
          password: configService.get('REDIS_PASS'),
          ttl: configService.get('REDIS_TTL'), // seconds
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
