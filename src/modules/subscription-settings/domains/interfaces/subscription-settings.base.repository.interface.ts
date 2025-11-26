import { ChannelSubscriptions } from '../subscription-settings';

export interface BaseSubscriptionSettingsRepository {
  getSubscriptions(id: string): Promise<ChannelSubscriptions>;
}
