import { NotificationChannel } from '@common/enums/notification-channel';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TemplateCommon } from '@notification-types/domains/notification-type';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  collection: 'notification_types',
})
export class NotificationTypeDocument extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({
    type: Map,
    of: new MongooseSchema(
      {
        subject: { type: String },
        content: { type: String },
      },
      { _id: false },
    ),
  })
  templates: Map<NotificationChannel, TemplateCommon>;
}

export const NotificationTypeSchema = SchemaFactory.createForClass(
  NotificationTypeDocument,
);
