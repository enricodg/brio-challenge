import { NotificationChannel } from '@common/enums/notification-channel';

export type NotificationJobData = {
  userId: string;
  companyId: string;
  notificationType: string;
  channel: NotificationChannel;
  payload: {
    subject?: string;
    content?: string;
  };
};
