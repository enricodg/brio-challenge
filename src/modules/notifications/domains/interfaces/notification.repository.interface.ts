import { NotificationChannel } from '@common/enums/notification-channel';
import { Notification } from '@notifications/domains/notification';

export abstract class NotificationRepository {
  abstract findByUserIdAndChannel(
    userId: string,
    channel: NotificationChannel,
  ): Promise<Notification[]>;

  abstract create(data: {
    userId: string;
    channel: NotificationChannel;
    subject: string;
    content: string;
  }): Promise<Notification>;
}
