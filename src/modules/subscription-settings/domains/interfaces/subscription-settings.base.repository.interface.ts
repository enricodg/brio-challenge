import { ChannelSubscriptions } from '../subscription-settings';

export abstract class BaseSubscriptionSettingsRepository {
  abstract getSubscriptions(id: string): Promise<ChannelSubscriptions>;
}

export abstract class UserSubscriptionSettingsRepository extends BaseSubscriptionSettingsRepository {}

export abstract class CompanySubscriptionSettingsRepository extends BaseSubscriptionSettingsRepository {}
