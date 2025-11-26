import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsController } from '@notifications/presentation/http/notification.controller';
import { NotificationUseCase } from '@notifications/usecases/notification.usecase';
import { NotificationRepositoryImpl } from '@notifications/infrastructure/persistence/notification.repository';
import { NotificationSchema } from '@notifications/infrastructure/persistence/notification.schema';
import { NotificationProcessor } from '@notifications/presentation/queues/notification.processor';
import { NotificationRepository } from '@notifications/domains/interfaces/notification.repository.interface';
import { NotificationTypesModule } from '@notification-types/notification-types.module';
import { ExternalModule } from '@common/external/external.module';
import { SubscriptionSettingsModule } from '@subscriptions/subscription-settings.module';
import { NotificationChannel } from '@common/enums/notification-channel';
import { UiNotificationSender } from '@notifications/infrastructure/channels/ui/ui.notification.sender';
import { EmailNotificationSender } from '@notifications/infrastructure/channels/email/email.notification.sender';

export const NOTIFICATION_CHANNEL_SENDERS = Symbol(
  'NotificationChannelSenders',
);

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    BullModule.registerQueue({ name: 'notifications' }),
    NotificationTypesModule,
    ExternalModule,
    SubscriptionSettingsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    { provide: NotificationRepository, useClass: NotificationRepositoryImpl },
    {
      provide: NOTIFICATION_CHANNEL_SENDERS,
      useFactory: (repo: NotificationRepository) => ({
        [NotificationChannel.UI]: new UiNotificationSender(repo),
        [NotificationChannel.EMAIL]: new EmailNotificationSender(),
      }),
      inject: [NotificationRepository],
    },
    NotificationUseCase,
    NotificationProcessor,
  ],
})
export class NotificationsModule {}
