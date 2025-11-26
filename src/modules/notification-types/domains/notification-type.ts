import { NotificationChannel } from '@common/enums/notification-channel';

export type TemplateCommon = {
  subject?: string;
  content?: string;
};

export type ChannelTemplates = Record<NotificationChannel, TemplateCommon>;

export class NotificationType {
  constructor(key: string, templates: ChannelTemplates) {
    this._key = key;
    this._templates = templates;
  }

  private _key: string;
  private _templates: ChannelTemplates;

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }

  get templates(): ChannelTemplates {
    return this._templates;
  }

  set templates(value: ChannelTemplates) {
    this._templates = value;
  }
}
