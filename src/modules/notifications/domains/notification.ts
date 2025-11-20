import { NotificationChannel } from '@common/enums/notification-channel';

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly channel: NotificationChannel,
    public readonly subject: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly readAt?: Date | null,
  ) {}
}
