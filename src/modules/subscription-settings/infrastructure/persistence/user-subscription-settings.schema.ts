import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SubscriptionSettingsBaseDocument } from './subscription-settings.base.schema';

@Schema({ collection: 'user_subscription_settings' })
export class UserSubscriptionSettingsDocument extends SubscriptionSettingsBaseDocument {}

export const UserSubscriptionSettingsSchema = SchemaFactory.createForClass(
  UserSubscriptionSettingsDocument,
);
