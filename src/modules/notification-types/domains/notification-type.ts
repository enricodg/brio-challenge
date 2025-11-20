import { NotificationChannel } from '@common/enums/notification-channel';

export type TemplateCommon = {
  subject?: string;
  content?: string;
};

export type ChannelTemplates = Record<NotificationChannel, TemplateCommon>;

export class NotificationType {
  constructor(
    public readonly key: string,
    public readonly templates: ChannelTemplates,
  ) {}
}
