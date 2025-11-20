import { NotificationChannel } from '@common/enums/notification-channel';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'notifications',
  timestamps: true,
})
export class NotificationDocument extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: Object.values(NotificationChannel) })
  channel: string;

  @Prop({ required: false })
  subject: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: null })
  readAt?: Date | null;

  createdAt: Date;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
