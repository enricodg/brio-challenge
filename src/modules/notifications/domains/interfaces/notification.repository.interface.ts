import { NotificationChannel } from '@common/enums/notification-channel';
import { Notification } from '@notifications/domains/notification';

export interface NotificationRepository {
  findByUserIdAndChannel(
    userId: string,
    channel: NotificationChannel,
  ): Promise<Notification[]>;

  findByUserIdAndChannelPaged(
    userId: string,
    channel: NotificationChannel,
    page: number,
    limit: number,
  ): Promise<{ items: Notification[]; total: number }>;

  create(data: {
    userId: string;
    channel: NotificationChannel;
    subject: string;
    content: string;
  }): Promise<Notification>;
}
