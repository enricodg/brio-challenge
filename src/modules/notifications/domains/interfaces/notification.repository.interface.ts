import { NotificationChannel } from '@common/enums/notification-channel';
import { Notification } from '@notifications/domains/notification';

export interface NotificationRepository {

  findByUserIdAndChannelPaged(
    userId: string,
    channel: NotificationChannel,
    page: number,
    limit: number,
  ): Promise<{ items: Notification[]; total: number }>;

  create(notification: Notification): Promise<Notification>;
}
