import { upperCase } from 'lodash';

export function getQueueToken(name?: string): string {
  return name ? `BULL_QUEUE_${upperCase(name)}` : 'BULL_QUEUE_DEFAULT';
}