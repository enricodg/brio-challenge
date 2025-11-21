import { Inject, Injectable } from '@nestjs/common';
import { BaseSubscriptionSettingsUseCase } from './subscription-settings.base.usecase';
import { UserSubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/subscription-settings.base.repository.interface';

@Injectable()
export class UserSubscriptionSettingsUseCase extends BaseSubscriptionSettingsUseCase {
  constructor(
    @Inject(UserSubscriptionSettingsRepository)
    repo: UserSubscriptionSettingsRepository,
  ) {
    super(repo);
  }
}
