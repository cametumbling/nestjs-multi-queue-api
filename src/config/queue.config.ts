//parses queue client ENV vars

import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config();

export function loadQueueClients(): string[] {
  const raw = process.env.QUEUE_CLIENTS;
  if (!raw) throw new Error('QUEUE_CLIENTS not set');
  return raw
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
}
