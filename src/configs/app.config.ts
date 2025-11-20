import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    globalPrefix: '/api',
    http: {
      port: Number.parseInt(process.env.HTTP_PORT || '3000'),
    },
  }),
);
