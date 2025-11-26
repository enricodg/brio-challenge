import { NotificationChannel } from '@common/enums/notification-channel';

export class Notification {
  constructor(
    id: string,
    userId: string,
    channel: NotificationChannel,
    subject: string,
    content: string,
    createdAt: Date,
    readAt?: Date | null,
  ) {
    this._id = id;
    this._userId = userId;
    this._channel = channel;
    this._subject = subject;
    this._content = content;
    this._createdAt = createdAt;
    this._readAt = readAt ?? null;
  }

  static create(params: {
    id: string | null;
    userId: string;
    channel: NotificationChannel;
    subject: string;
    content: string;
  }): Notification {
    return new Notification(
      params.id ?? '',
      params.userId,
      params.channel,
      params.subject,
      params.content,
      new Date(),
      null,
    );
  }

  private _id: string | null;
  private _userId: string;
  private _channel: NotificationChannel;
  private _subject: string;
  private _content: string;
  private _createdAt: Date;
  private _readAt: Date | null;

  get id(): string | null {
    return this._id;
  }
  set id(value: string | null) {
    this._id = value;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get channel(): NotificationChannel {
    return this._channel;
  }
  set channel(value: NotificationChannel) {
    this._channel = value;
  }

  get subject(): string {
    return this._subject;
  }
  set subject(value: string) {
    this._subject = value;
  }

  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get readAt(): Date | null {
    return this._readAt;
  }
  set readAt(value: Date | null) {
    this._readAt = value;
  }
}
