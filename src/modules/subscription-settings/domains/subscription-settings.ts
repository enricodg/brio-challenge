import { NotificationChannel } from '@common/enums/notification-channel';

export type ChannelSubscriptions = Partial<
  Record<NotificationChannel, boolean>
>;
