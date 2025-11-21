import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanySubscriptionSettingsDocument } from './company-subscription-settings.schema';
import { ChannelSubscriptions } from '@subscriptions/domains/subscription-settings';
import { NotificationChannel } from '@common/enums/notification-channel';
import { CompanySubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/company-subscription-settings.repository.interface';

@Injectable()
export class CompanySubscriptionSettingsRepositoryImpl
  implements CompanySubscriptionSettingsRepository
{
  constructor(
    @InjectModel('CompanySubscriptionSettings')
    private readonly model: Model<CompanySubscriptionSettingsDocument>,
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
