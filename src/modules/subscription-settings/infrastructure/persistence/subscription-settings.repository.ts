import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/subscription-settings.repository.interface';
import { UserSubscriptionSettingsDocument } from './user-subscription-settings.schema';
import { CompanySubscriptionSettingsDocument } from './company-subscription-settings.schema';
import { NotificationChannel } from '@common/enums/notification-channel';
import { ChannelSubscriptions } from '@subscriptions/domains/subscription-settings';

@Injectable()
export class SubscriptionSettingsRepositoryImpl
  implements SubscriptionSettingsRepository
{
  constructor(
    @InjectModel('UserSubscriptionSettings')
    private readonly userModel: Model<UserSubscriptionSettingsDocument>,
    @InjectModel('CompanySubscriptionSettings')
    private readonly companyModel: Model<CompanySubscriptionSettingsDocument>,
  ) {}

  async getUserSubscriptions(userId: string): Promise<ChannelSubscriptions> {
    const doc = await this.userModel.findOne({ userId }).lean().exec();
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

  async getCompanySubscriptions(
    companyId: string,
  ): Promise<ChannelSubscriptions> {
    const doc = await this.companyModel.findOne({ companyId }).lean().exec();
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
