import { NotificationChannel } from '@common/enums/notification-channel';
import { Notification } from '@notifications/domains/notification';

export abstract class NotificationRepository {
  abstract findByUserIdAndChannel(
    userId: string,
    channel: NotificationChannel,
  ): Promise<Notification[]>;

  abstract findByUserIdAndChannelPaged(
    userId: string,
    channel: NotificationChannel,
    page: number,
    limit: number,
  ): Promise<{ items: Notification[]; total: number }>;

  abstract create(data: {
    userId: string;
    channel: NotificationChannel;
    subject: string;
    content: string;
  }): Promise<Notification>;
}
