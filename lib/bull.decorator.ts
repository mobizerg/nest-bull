import { Inject } from '@nestjs/common';
import { getQueueToken } from './bull.helper';

export function InjectQueue(name?: string): ParameterDecorator {
  return Inject(getQueueToken(name));
}