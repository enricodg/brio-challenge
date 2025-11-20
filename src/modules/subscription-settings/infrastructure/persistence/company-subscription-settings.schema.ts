import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { NotificationChannel } from '@common/enums/notification-channel';

@Schema({
  collection: 'company_subscription_settings',
})
export class CompanySubscriptionSettingsDocument extends Document {
  @Prop({ required: true, unique: true })
  companyId: string;

  @Prop({
    type: Map,
    of: new MongooseSchema(
      {
        subscribed: { type: Boolean, default: true },
      },
      { _id: false },
    ),
  })
  channels?: Map<NotificationChannel, { subscribed: boolean }> | null;
}

export const CompanySubscriptionSettingsSchema = SchemaFactory.createForClass(
  CompanySubscriptionSettingsDocument,
);
