import { Inject, Injectable } from '@nestjs/common';
import { BaseSubscriptionSettingsUseCase } from './subscription-settings.base.usecase';
import type { UserSubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/user-subscription-settings.repository.interface';

@Injectable()
export class UserSubscriptionSettingsUseCase extends BaseSubscriptionSettingsUseCase {
  constructor(
    @Inject('UserSubscriptionSettingsRepository')
    repo: UserSubscriptionSettingsRepository,
  ) {
    super(repo);
  }
}
