import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from './modules/notifications/notifications.module';
import configs from '@config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configs,
      envFilePath: ['.env'],
    }),

    // MongoDB Module
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
