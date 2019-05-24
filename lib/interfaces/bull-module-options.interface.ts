import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { QueueOptions } from 'bull';

export interface BullModuleOptions {
  name?: string;
  options?: QueueOptions;
}

export interface BullOptionsFactory {
  createBullOptions(name?: string): Promise<BullModuleOptions> | BullModuleOptions;
}

export interface BullModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<BullOptionsFactory>;
  useClass?: Type<BullOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<BullModuleOptions> | BullModuleOptions;
  inject?: any[];
}