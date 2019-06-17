export function getQueueToken(name?: string): string {
  return name ? `BULL_QUEUE_${name.toUpperCase()}` : 'BULL_QUEUE_DEFAULT';
}
