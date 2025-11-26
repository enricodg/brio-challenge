import { Inject, Injectable } from '@nestjs/common';
import { BaseSubscriptionSettingsUseCase } from './subscription-settings.base.usecase';
import type { CompanySubscriptionSettingsRepository } from '@subscriptions/domains/interfaces/company-subscription-settings.repository.interface';

@Injectable()
export class CompanySubscriptionSettingsUseCase extends BaseSubscriptionSettingsUseCase {
  constructor(
    @Inject('CompanySubscriptionSettingsRepository')
    repo: CompanySubscriptionSettingsRepository,
  ) {
    super(repo);
  }
}
