import { BaseSubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/subscription-settings.base.repository.interface';
import { ChannelSubscriptions } from '@subscriptions/domains/subscription-settings';

export abstract class BaseSubscriptionSettingsUseCase {
  constructor(private readonly repo: BaseSubscriptionSettingsRepository) {}

  async getSubscriptions(id: string): Promise<ChannelSubscriptions> {
    return this.repo.getSubscriptions(id);
  }
}
