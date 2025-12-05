//parses queue client ENV vars

export function loadQueueClients(): string[] {
  const raw = process.env.QUEUE_CLIENTS;
  if (!raw) throw new Error('QUEUE_CLIENTS not set');
  return raw.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
}