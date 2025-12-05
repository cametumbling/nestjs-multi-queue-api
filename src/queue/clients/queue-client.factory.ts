//decides which queue(s) to use from ENV vars

import { QueueClient } from './queue-client.interface';
import { SqsClient } from './sqs.client';
import { RabbitClient } from './rabbit.client';
import { GcpClient } from './gcp.client';
import { CompositeClient } from './composite.client';

export function createQueueClient(names: string[]): QueueClient {
  // only one queue client used
  if (names.length === 1) {
    return build(names[0]);
  }

  // composite fan-out (multiple queues used)
  return new CompositeClient(names.map((n) => build(n)));
}

function build(name: string): QueueClient {
  switch (name) {
    case 'sqs':
      return new SqsClient(process.env.SQS_QUEUE_URL!);

    case 'rabbitmq':
      return new RabbitClient(process.env.RABBITMQ_URL!);

    case 'gcp':
      return new GcpClient(process.env.GCP_PROJECT_ID!);

    default:
      throw new Error(`Unknown queue client: ${name}`);
  }
}
