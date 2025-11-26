import { Notification } from '@notifications/domains/notification';
import { NotificationDocument } from './notification.schema';
import mongoose from 'mongoose';
import { NotificationChannel } from '@common/enums/notification-channel';

export class NotificationMapper {
  static toDomain(persistence: {
    id: string
    userId: string,
    channel: NotificationChannel,
    subject: string,
    content: string,
    createdAt: Date,
    readAt?: Date | null
  }): Notification {
    return new Notification(
      persistence.id,
      persistence.userId,
      persistence.channel,
      persistence.subject,
      persistence.content,
      persistence.createdAt,
      persistence.readAt
    );
  }

  static toPersistence(domain: Notification): NotificationDocument {
    return {
      _id: domain.id ? new mongoose.Types.ObjectId(domain.id) : null,
      userId: domain.userId,
      channel: domain.channel,
      subject: domain.subject,
      content: domain.content,
      readAt: domain.readAt,
      createdAt: domain.createdAt,
    } as NotificationDocument;
  }

  static toDomainArray(
    persistence: {
    id: string
    userId: string,
    channel: NotificationChannel,
    subject: string,
    content: string,
    createdAt: Date
  }[],
  ): Notification[] {
    return persistence.map((model) => this.toDomain(model));
  }
}
