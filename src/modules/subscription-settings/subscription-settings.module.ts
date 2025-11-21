import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSubscriptionSettingsRepository,
  CompanySubscriptionSettingsRepository,
} from './domains/interfaces/subscription-settings.base.repository.interface';
import { UserSubscriptionSettingsRepositoryImpl } from './infrastructure/persistence/user-subscription-settings.repository';
import { CompanySubscriptionSettingsRepositoryImpl } from './infrastructure/persistence/company-subscription-settings.repository';
import { UserSubscriptionSettingsSchema } from './infrastructure/persistence/user-subscription-settings.schema';
import { CompanySubscriptionSettingsSchema } from './infrastructure/persistence/company-subscription-settings.schema';
import { UserSubscriptionSettingsUseCase } from './usecases/user-subscription-settings.usecase';
import { CompanySubscriptionSettingsUseCase } from './usecases/company-subscription-settings.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserSubscriptionSettings',
        schema: UserSubscriptionSettingsSchema,
      },
      {
        name: 'CompanySubscriptionSettings',
        schema: CompanySubscriptionSettingsSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: UserSubscriptionSettingsRepository,
      useClass: UserSubscriptionSettingsRepositoryImpl,
    },
    {
      provide: CompanySubscriptionSettingsRepository,
      useClass: CompanySubscriptionSettingsRepositoryImpl,
    },
    UserSubscriptionSettingsUseCase,
    CompanySubscriptionSettingsUseCase,
  ],
  exports: [
    UserSubscriptionSettingsUseCase,
    CompanySubscriptionSettingsUseCase,
  ],
})
export class SubscriptionSettingsModule {}
