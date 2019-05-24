<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A Bull redis queue integration module for Nest.js framework.
</p>

### Installation

**Yarn**
```bash
yarn add @mobizerg/nest-bull bull ioredis
yarn add @types/bull --dev
```

**NPM**
```bash
npm install @mobizerg/nest-bull bull ioredis --save
npm install @types/bull --save-dev
```

### Description
Redis Queue integration module for [Nest.js](https://github.com/nestjs/nest) based on the [Bull](https://github.com/OptimalBits/bull) package.

### Usage

Import the **BullModule** in `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@mobizerg/nest-bull';
import { QueueJobProcessor } from './queue-job.processor';

@Module({
    imports: [
        BullModule.register(options),
    ],
    providers: [QueueJobProcessor],
})
export class AppModule {}
```
With Async
```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@mobizerg/nest-bull';
import { QueueJobProcessor } from './queue-job.processor';

@Module({
    imports: [
        BullModule.registerAsync({
            imports: [ConfigModule],
            useExisting: BullConfigService,
        }),
    ],
    providers: [QueueJobProcessor],
})
export class AppModule {}
```

Example config file (async)
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { BullModuleOptions, BullOptionsFactory } from '@mobizerg/nest-bull';

@Injectable()
export class BullConfigService implements BullOptionsFactory {

  constructor(private readonly config: ConfigService) {}

  createBullOptions(name?: string): BullModuleOptions {
      
    return {
      name,
      options: {
        redis: {
          host: this.config.redisHost,
          port: this.config.redisPort,
          db: this.config.redisDatabase,
          keyPrefix: this.config.redisPrefix + ':bull',
        },
        defaultJobOptions: {
          timeout: 30 * 1000,
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 5 * 60 * 1000,
          },
        },
      },
    };
  }
}
```

Example usage inside services
```typescript
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@mobizerg/nest-bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {

  constructor(@InjectQueue()
              private readonly queue: Queue) {}

  async addToQueue(data: T) {
    await this.queue.add(QUEUE_JOB_PROCESSOR, data);
  }
}
```

Example queue job processor
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@mobizerg/nest-bull';
import { Job, Queue } from 'bull';

@Injectable()
export class QueueJobProcessor implements OnModuleInit {

  constructor(@InjectQueue()
              private readonly queue: Queue) {}

  onModuleInit() {

    this.queue.process(QUEUE_JOB_PROCESSOR, (job: Job<T>) => {
      return 'completed';
    });
  }
}
```

### License

MIT
