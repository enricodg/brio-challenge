import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SubscriptionSettingsBaseDocument } from './subscription-settings.base.schema';

@Schema({ collection: 'company_subscription_settings' })
export class CompanySubscriptionSettingsDocument extends SubscriptionSettingsBaseDocument {}

export const CompanySubscriptionSettingsSchema = SchemaFactory.createForClass(
  CompanySubscriptionSettingsDocument,
);
