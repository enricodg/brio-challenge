import { NotificationSender } from '../notification.sender.interface';
import { NotificationJobData } from '@notifications/dtos/notification.job.dto';

export class EmailNotificationSender implements NotificationSender {
  send(data: NotificationJobData): Promise<void> {
    const { payload } = data;
    console.log(
      `email to ${data.userId} | ${payload.subject ?? ''} | ${payload.content ?? ''}`,
    );
    return Promise.resolve();
  }
}
