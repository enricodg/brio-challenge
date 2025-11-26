import { NotificationJobData } from '@notifications/dtos/notification.job.dto';

export interface NotificationSender {
  send(data: NotificationJobData): Promise<void>;
}
