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

  availableChannels(): NotificationChannel[] {
    return Object.keys(this._templates) as NotificationChannel[];
  }

  render(
    channel: NotificationChannel,
    context: Record<string, string>,
  ): { subject?: string; content?: string } {
    const tpl = this._templates[channel];
    if (!tpl) return {};
    const ctx = { ...context };
    if (!ctx.firstName && ctx.name)
      ctx.firstName = String(ctx.name).split(' ')[0] || '';
    const interpolate = (s?: string) =>
      s?.replace(/{{\s*([\w]+)\s*}}/g, (_: string, key: string) =>
        key in ctx ? ctx[key] : '',
      );
    const subject = interpolate(tpl.subject);
    const content = interpolate(tpl.content);
    return { subject, content };
  }
}
