import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotificationType,
  TemplateCommon,
} from '@notification-types/domains/notification-type';
import { NotificationTypeRepository } from '@notification-types/domains/interfaces/notification-type-repository.interface';
import { NotificationTypeDocument } from './notification-type.schema';
import { NotificationChannel } from '@common/enums/notification-channel';

@Injectable()
export class NotificationTypeRepositoryImpl
  implements NotificationTypeRepository
{
  constructor(
    @InjectModel('NotificationType')
    private readonly model: Model<NotificationTypeDocument>,
  ) {}

  async findByKey(key: string): Promise<NotificationType | null> {
    const doc = await this.model.findOne({ key }).lean().exec();
    if (!doc) return null;
    return this.map(doc);
  }

  private map(d: {
    key: string;
    templates: Record<NotificationChannel, TemplateCommon>;
  }): NotificationType {
    return new NotificationType(String(d.key), d.templates);
  }
}
