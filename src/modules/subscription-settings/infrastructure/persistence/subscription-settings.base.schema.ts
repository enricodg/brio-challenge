import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { NotificationChannel } from '@common/enums/notification-channel';

export const ChannelsEntrySchema = new MongooseSchema(
  { subscribed: { type: Boolean, default: true } },
  { _id: false },
);

@Schema()
export class SubscriptionSettingsBaseDocument extends Document {
  @Prop({ required: true, unique: true })
  declare id: string;

  @Prop({
    type: Map,
    of: ChannelsEntrySchema,
  })
  channels?: Map<NotificationChannel, { subscribed: boolean }> | null;
}
