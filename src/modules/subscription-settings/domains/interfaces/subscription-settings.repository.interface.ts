import { ChannelSubscriptions } from '../subscription-settings';

export abstract class SubscriptionSettingsRepository {
  abstract getUserSubscriptions(userId: string): Promise<ChannelSubscriptions>;
  abstract getCompanySubscriptions(
    companyId: string,
  ): Promise<ChannelSubscriptions>;
}
