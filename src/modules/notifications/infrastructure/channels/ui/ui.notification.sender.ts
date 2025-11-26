import { NotificationChannel } from '@common/enums/notification-channel';
import { NotificationRepository } from '@notifications/domains/interfaces/notification.repository.interface';
import { NotificationJobData } from '@notifications/dtos/notification.job.dto';
import { NotificationSender } from '../notification.sender.interface';

export class UiNotificationSender implements NotificationSender {
  constructor(private readonly repository: NotificationRepository) {}

  async send(data: NotificationJobData): Promise<void> {
    const { payload } = data;
    await this.repository.create({
      userId: data.userId,
      channel: NotificationChannel.UI,
      subject: payload.subject ?? '',
      content: payload.content ?? '',
    });
  }
}
