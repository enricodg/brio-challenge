import { Inject, Injectable } from '@nestjs/common';
import { ChannelSubscriptions } from '@subscriptions/domains/subscription-settings';
import { BaseSubscriptionSettingsUseCase } from './subscription-settings.base.usecase';
import { CompanySubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/subscription-settings.base.repository.interface';

@Injectable()
export class CompanySubscriptionSettingsUseCase extends BaseSubscriptionSettingsUseCase {
  constructor(
    @Inject(CompanySubscriptionSettingsRepository)
    repo: CompanySubscriptionSettingsRepository,
  ) {
    super(repo);
  }
}
