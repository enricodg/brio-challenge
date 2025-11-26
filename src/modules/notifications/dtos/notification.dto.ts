import { NotificationChannel } from '@common/enums/notification-channel';
import type { Notification } from '@notifications/domains/notification';

export class NotificationDto {
  id: string;
  channel: NotificationChannel;
  subject: string;
  content: string;
  createdAt: Date;
  readAt?: Date | null;

  static fromDomain(n: Notification): NotificationDto {
    const dto = new NotificationDto();
    dto.id = n.id ?? '';
    dto.channel = n.channel;
    dto.subject = n.subject;
    dto.content = n.content;
    dto.createdAt = n.createdAt;
    dto.readAt = n.readAt ?? null;
    return dto;
  }
}
