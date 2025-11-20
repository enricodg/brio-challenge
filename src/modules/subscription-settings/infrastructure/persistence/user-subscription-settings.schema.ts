import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { NotificationChannel } from '@common/enums/notification-channel';

@Schema({
  collection: 'user_subscription_settings',
})
export class UserSubscriptionSettingsDocument extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

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

export const UserSubscriptionSettingsSchema = SchemaFactory.createForClass(
  UserSubscriptionSettingsDocument,
);
