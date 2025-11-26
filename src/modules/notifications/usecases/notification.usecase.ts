import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationRepository } from '@notifications/domains/interfaces/notification.repository.interface';
import { Notification } from '@notifications/domains/notification';
import { NotificationSendDto } from '@notifications/dtos/notification.send.dto';
import { NotificationChannel } from '@common/enums/notification-channel';
import { NotificationTypeUseCase } from '@notification-types/usecases/notification-type.usecase';
import { UserService } from '@common/external/user/user.service.interface';
import { UserSubscriptionSettingsUseCase } from '@subscriptions/usecases/user-subscription-settings.usecase';
import { CompanySubscriptionSettingsUseCase } from '@subscriptions/usecases/company-subscription-settings.usecase';
import { NotificationJobData } from '@notifications/dtos/notification.job.dto';

@Injectable()
export class NotificationUseCase {
  constructor(
    @Inject(NotificationRepository)
    private readonly repository: NotificationRepository,
    @InjectQueue('notifications')
    private readonly queue: Queue,
    private readonly notificationTypeUseCase: NotificationTypeUseCase,
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly userSubsUseCase: UserSubscriptionSettingsUseCase,
    private readonly companySubsUseCase: CompanySubscriptionSettingsUseCase,
  ) {}

  async getNotificationByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ items: Notification[]; total: number }> {
    return this.repository.findByUserIdAndChannelPaged(
      userId,
      NotificationChannel.UI,
      page,
      limit,
    );
  }

  async sendNotification(dto: NotificationSendDto): Promise<boolean> {
    const type = await this.notificationTypeUseCase.getByKey(
      dto.notificationType,
    );
    if (!type) return false;

    const templates = type.templates;
    const availableChannels = Object.keys(templates);

    const userSubs = await this.userSubsUseCase.getSubscriptions(dto.userId);
    const companySubs = await this.companySubsUseCase.getSubscriptions(
      dto.companyId,
    );

    const filteredChannels = availableChannels.filter(
      (c) => (userSubs[c] ?? true) && (companySubs[c] ?? true),
    );

    if (filteredChannels.length === 0) return false;

    const { user } = this.userService.getUserCompanyProfile(
      dto.userId,
      dto.companyId,
    );

    const render = (tpl?: { subject?: string; content?: string }) => {
      const ctx: Record<string, string> = {};
      for (const [k, v] of Object.entries(user ?? {})) ctx[k] = String(v ?? '');
      if (!ctx.firstName && ctx.name)
        ctx.firstName = String(ctx.name).split(' ')[0] || '';
      const interpolate = (s?: string) =>
        s?.replace(/{{\s*([\w]+)\s*}}/g, (_: string, key: string) =>
          key in ctx ? ctx[key] : '',
        );
      const subject = interpolate(tpl?.subject);
      const content = interpolate(tpl?.content);
      return { subject, content };
    };

    for (const ch of filteredChannels) {
      const tpl = templates[ch as NotificationChannel];
      const rendered = render(tpl);
      if (!rendered.subject && !rendered.content) continue;

      await this.queue.add(
        'send',
        {
          userId: dto.userId,
          companyId: dto.companyId,
          notificationType: dto.notificationType,
          channel: ch as NotificationChannel,
          payload: rendered,
        } as NotificationJobData,
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    }
    return true;
  }

  async processJob(data: NotificationJobData): Promise<void> {
    const { channel, payload } = data;
    if (channel === NotificationChannel.UI) {
      try {
        await this.repository.create({
          userId: data.userId,
          channel: NotificationChannel.UI,
          subject: payload.subject ?? '',
          content: payload.content ?? '',
        });
      } catch (err) {
        console.error(
          'NotificationProcessor create error',
          channel,
          data.userId,
          (err as Error)?.message,
        );
        throw err;
      }
    }
    if (channel === NotificationChannel.EMAIL) {
      console.log(
        `email to ${data.userId} | ${payload.subject ?? ''} | ${payload.content ?? ''}`,
      );
    }
  }
}
