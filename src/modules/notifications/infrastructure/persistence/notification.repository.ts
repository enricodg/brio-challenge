import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../domains/notification';
import { NotificationRepository } from '../../domains/interfaces/notification.repository.interface';
import { NotificationDocument } from './notification.schema';
import { NotificationChannel } from '@common/enums/notification-channel';
import { NotificationMapper } from './notification.mapper';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectModel('Notification')
    private readonly model: Model<NotificationDocument>,
  ) {}

  async findByUserIdAndChannelPaged(
    userId: string,
    channel: NotificationChannel,
    page: number,
    limit: number,
  ): Promise<{ items: Notification[]; total: number }> {
    const filter = { userId, channel } as const;
    const total = await this.model.countDocuments(filter).exec();
    const docs = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(Math.max(0, (page - 1) * limit))
      .limit(Math.max(1, limit))
      .lean()
      .exec();

    const items = docs.map((d) =>
      NotificationMapper.toDomain({
        id: String(d._id),
        userId: d.userId,
        channel: d.channel as NotificationChannel,
        subject: d.subject,
        content: d.content,
        readAt: d.readAt ?? null,
        createdAt: d.createdAt,
      }),
    );

    return { items, total };
  }

  async create(notification: Notification): Promise<Notification> {
    const persistence = NotificationMapper.toPersistence(notification);
    const doc = await this.model.create(persistence);
    return NotificationMapper.toDomain({
      id: String(doc._id),
      userId: doc.userId,
      channel: doc.channel as NotificationChannel,
      subject: doc.subject,
      content: doc.content,
      readAt: doc.readAt ?? null,
      createdAt: doc.createdAt,
    });
  }
}
