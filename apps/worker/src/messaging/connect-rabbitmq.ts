import amqp, { type ChannelModel } from 'amqplib';

export async function connectRabbitMq(url: string): Promise<ChannelModel> {
  return amqp.connect(url);
}
