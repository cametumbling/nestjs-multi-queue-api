//client interface definition
export interface QueueClient {
  publish(topic: string, message: unknown): Promise<void>;
  consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void>;
}
