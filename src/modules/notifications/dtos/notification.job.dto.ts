import { NotificationChannel } from "@common/enums/notification-channel";

export type NotificationJobData = {
  userId: string;
  companyId: string;
  notificationType: string;
  snapshot: Record<
    NotificationChannel,
    {
      subject?: string;
      content?: string;
    }
  >;
};