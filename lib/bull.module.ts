import { DynamicModule, Inject, Module, Provider } from '@nestjs/common';
import { BullModuleAsyncOptions, BullModuleOptions, BullOptionsFactory } from './interfaces';
import { createBullQueue } from './bull-queue.provider';
import { BULL_MODULE_OPTIONS } from './bull.constant';
import { getQueueToken } from './bull.helper';

@Module({})
export class BullModule {

  constructor(@Inject(BULL_MODULE_OPTIONS)
              private readonly options: BullModuleOptions) {}

  static register(options: BullModuleOptions): DynamicModule {
    return {
      module: BullModule,
      providers: [
        createBullQueue(options.name),
        { provide: BULL_MODULE_OPTIONS, useValue: options },
      ],
      exports: [getQueueToken(options.name)],
    };
  }

  static registerAsync(options: BullModuleAsyncOptions): DynamicModule {
    return {
      module: BullModule,
      imports: options.imports || [],
      providers: [
        createBullQueue(options.name),
        ...this.createAsyncProviders(options),
      ],
      exports: [getQueueToken(options.name)],
    };
  }

  private static createAsyncProviders(options: BullModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  private static createAsyncOptionsProvider(options: BullModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: BULL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: BULL_MODULE_OPTIONS,
      useFactory: async (optionsFactory: BullOptionsFactory) => await optionsFactory.createBullOptions(options.name),
      inject: [options.useExisting || options.useClass],
    };
  }

  // async onModuleDestroy() {
  //   const queue = this.moduleRef.get<Queue>(getQueueToken(this.options.name));
  //   queue && (await queue.close());
  // }
}