import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../domains/notification';
import { NotificationRepository } from '../../domains/interfaces/notification.repository.interface';
import { NotificationDocument } from './notification.schema';
import { NotificationChannel } from '@common/enums/notification-channel';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectModel('Notification')
    private readonly model: Model<NotificationDocument>,
  ) {}

  async findByUserIdAndChannel(
    userId: string,
    channel: NotificationChannel,
  ): Promise<Notification[]> {
    const docs = await this.model
      .find({ userId, channel })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return docs.map(
      (d) =>
        new Notification(
          String(d._id),
          d.userId,
          channel,
          d.subject,
          d.content,
          d.createdAt,
          d.readAt ?? null,
        ),
    );
  }

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

    const items = docs.map(
      (d) =>
        new Notification(
          String(d._id),
          d.userId,
          channel,
          d.subject,
          d.content,
          d.createdAt,
          d.readAt ?? null,
        ),
    );

    return { items, total };
  }

  async create(data: {
    userId: string;
    channel: NotificationChannel;
    subject: string;
    content: string;
  }): Promise<Notification> {
    const doc = await this.model.create({
      userId: data.userId,
      channel: data.channel,
      subject: data.subject,
      content: data.content,
    });
    return new Notification(
      String(doc._id),
      doc.userId,
      data.channel,
      doc.subject,
      doc.content,
      doc.createdAt,
      doc.readAt ?? null,
    );
  }
}
