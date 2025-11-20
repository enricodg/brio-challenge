import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSettingsRepository } from './domains/interfaces/subscription-settings.repository.interface';
import { SubscriptionSettingsRepositoryImpl } from './infrastructure/persistence/subscription-settings.repository';
import { UserSubscriptionSettingsSchema } from './infrastructure/persistence/user-subscription-settings.schema';
import { CompanySubscriptionSettingsSchema } from './infrastructure/persistence/company-subscription-settings.schema';

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
      provide: SubscriptionSettingsRepository,
      useClass: SubscriptionSettingsRepositoryImpl,
    },
  ],
  exports: [SubscriptionSettingsRepository],
})
export class SubscriptionSettingsModule {}
