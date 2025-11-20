import { registerAs } from '@nestjs/config';

export default registerAs(
  'bullmq',
  (): Record<string, any> => ({
    host: process.env.BULLMQ_HOST || 'localhost',
    port: Number.parseInt(process.env.BULLMQ_PORT || '6379'),
  }),
);
