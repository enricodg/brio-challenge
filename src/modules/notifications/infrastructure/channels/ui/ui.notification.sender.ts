import { NotificationChannel } from '@common/enums/notification-channel';
import { NotificationRepository } from '@notifications/domains/interfaces/notification.repository.interface';
import { NotificationJobData } from '@notifications/dtos/notification.job.dto';
import { NotificationSender } from '../notification.sender.interface';
import { Notification } from '@notifications/domains/notification';

export class UiNotificationSender implements NotificationSender {
  constructor(private readonly repository: NotificationRepository) {}

  async send(data: NotificationJobData): Promise<void> {
    const { payload } = data;
    const notification = Notification.create({
      id: null,
      userId: data.userId,
      channel: NotificationChannel.UI,
      subject: payload.subject ?? '',
      content: payload.content ?? '',
    });
    await this.repository.create(notification);
  }
}
