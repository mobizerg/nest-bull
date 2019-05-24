import * as Bull from 'bull';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { BULL_MODULE_OPTIONS } from './bull.constant';
import { BullModuleOptions } from './interfaces';
import { getQueueToken } from './bull.helper';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export const createBullQueue: (name?: string) => FactoryProvider = (name?: string) => ({
  provide: getQueueToken(name),
  useFactory: (options: BullModuleOptions) => {
    const queue = new Bull(options.name, options.options);
    queue.on('stalled', (job: Job) => {
      Logger.error(`${job.name} processor stalled while executing jobId:${job.id}`);
    });
    return queue;
  },
  inject: [BULL_MODULE_OPTIONS],
});