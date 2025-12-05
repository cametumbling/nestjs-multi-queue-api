//AWS SQS agent

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { QueueClient } from './queue-client.interface';

export class SqsClient implements QueueClient {
  private readonly client = new SQSClient({});

  constructor(private readonly queueUrl: string) {}

  async publish(topic: string, message: unknown): Promise<void> {
    await this.client.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify({ topic, message }),
      }),
    );
  }

  async consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    // stub for test; real polling intentionally omitted
    await onMessage({ note: 'SQS consume stub', topic });
  }
}