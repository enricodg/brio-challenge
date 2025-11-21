import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSubscriptionSettingsDocument } from './user-subscription-settings.schema';
import { ChannelSubscriptions } from '@subscriptions/domains/subscription-settings';
import { NotificationChannel } from '@common/enums/notification-channel';
import { UserSubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/user-subscription-settings.repository.interface';

@Injectable()
export class UserSubscriptionSettingsRepositoryImpl
  implements UserSubscriptionSettingsRepository
{
  constructor(
    @InjectModel('UserSubscriptionSettings')
    private readonly model: Model<UserSubscriptionSettingsDocument>,
  ) {}

  async getSubscriptions(id: string): Promise<ChannelSubscriptions> {
    const doc = await this.model.findOne({ id }).lean().exec();
    const result: ChannelSubscriptions = {};
    if (doc?.channels) {
      const mapObj = doc.channels as unknown as Record<
        string,
        { subscribed?: boolean }
      >;
      for (const [key, value] of Object.entries(mapObj)) {
        const ch = String(key) as NotificationChannel;
        result[ch] = Boolean(value?.subscribed ?? true);
      }
    }
    return result;
  }
}
