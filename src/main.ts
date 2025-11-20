import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix: string =
    configService.get<string>('app.globalPrefix') ?? '';
  const port: number = configService.get<number>('app.http.port') ?? 3000;
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);
}
void bootstrap();
