import { Queue } from 'bullmq';
import { NotificationUseCase } from './notification.usecase';
import { NotificationRepository } from '@notifications/domains/interfaces/notification.repository.interface';
import { NotificationTypeUseCase } from '@notification-types/usecases/notification-type.usecase';
import { NotificationChannel } from '@common/enums/notification-channel';
import { UserSubscriptionSettingsUseCase } from '@subscriptions/usecases/user-subscription-settings.usecase';
import { CompanySubscriptionSettingsUseCase } from '@subscriptions/usecases/company-subscription-settings.usecase';
import { UserService } from '@common/external/user/user.service.interface';
import {
  NotificationType,
  ChannelTemplates,
} from '@notification-types/domains/notification-type';
import { UserSummary } from '@common/dtos/user/user.dto';
import { NotificationSender } from '@notifications/infrastructure/channels/notification.sender.interface';

class NotificationRepositoryStub implements NotificationRepository {
  findByUserIdAndChannel = jest.fn();
  findByUserIdAndChannelPaged = jest.fn();
  create = jest.fn();
}

class NotificationTypeUseCaseStub
  implements Pick<NotificationTypeUseCase, 'getByKey'>
{
  getByKey = jest.fn((key: string): Promise<NotificationType | null> => {
    if (key === 'happy-birthday') {
      return Promise.resolve(
        new NotificationType(key, {
          [NotificationChannel.UI]: { content: 'Happy Birthday {{firstName}}' },
          [NotificationChannel.EMAIL]: {
            subject: 'Happy Birthday {{firstName}}',
            content: '{{companyName}} is wishing you a happy birthday, etc.',
          },
        } as ChannelTemplates),
      );
    }
    return Promise.resolve(null);
  });
}

class UserSubscriptionSettingsUseCaseStub
  implements Pick<UserSubscriptionSettingsUseCase, 'getSubscriptions'>
{
  constructor(
    private readonly subs: Record<NotificationChannel, boolean> = {
      [NotificationChannel.EMAIL]: true,
      [NotificationChannel.UI]: true,
    },
  ) {}
  getSubscriptions = jest.fn(() => Promise.resolve(this.subs));
}

class CompanySubscriptionSettingsUseCaseStub
  implements Pick<CompanySubscriptionSettingsUseCase, 'getSubscriptions'>
{
  constructor(
    private readonly subs: Record<NotificationChannel, boolean> = {
      [NotificationChannel.EMAIL]: true,
      [NotificationChannel.UI]: true,
    },
  ) {}
  getSubscriptions = jest.fn(() => Promise.resolve(this.subs));
}

class UserServiceStub implements UserService {
  getUserCompanyProfile(
    _userId: string,
    _companyId: string,
  ): { user: UserSummary } {
    void _userId;
    void _companyId;
    return { user: { firstName: 'John', companyName: 'Acme Inc' } };
  }
}

describe('NotificationUseCase', () => {
  it('keeps UI only when user unsubscribes EMAIL', async () => {
    const repo = new NotificationRepositoryStub();
    const queueAdd = jest.fn<unknown, [string, any, any]>();
    const queue = { add: queueAdd } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub({
      [NotificationChannel.EMAIL]: false,
      [NotificationChannel.UI]: true,
    });
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub({
      [NotificationChannel.EMAIL]: true,
      [NotificationChannel.UI]: true,
    });
    const handlers: Record<NotificationChannel, NotificationSender> = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
      [NotificationChannel.EMAIL]: { send: jest.fn(() => Promise.resolve()) },
    };
    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers
    );

    await usecase.sendNotification({
      userId: 'u1',
      companyId: 'c1',
      notificationType: 'happy-birthday',
    });

    expect(queueAdd.mock.calls.length).toBe(1);
    expect(queueAdd.mock.calls[0][0]).toBe('send');
    const payload = queueAdd.mock.calls[0][1] as {
      channel: NotificationChannel;
      payload: { subject?: string; content?: string };
    };
    expect(payload.channel).toBe(NotificationChannel.UI);
    expect(payload.payload?.content).toBe('Happy Birthday John');
  });

  it('keeps EMAIL only when company unsubscribes UI', async () => {
    const repo = new NotificationRepositoryStub();
    const queueAdd = jest.fn<unknown, [string, any, any]>();
    const queue = { add: queueAdd } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub({
      [NotificationChannel.EMAIL]: true,
      [NotificationChannel.UI]: true,
    });
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub({
      [NotificationChannel.EMAIL]: true,
      [NotificationChannel.UI]: false,
    });
    const handlers: Record<NotificationChannel, NotificationSender> = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
      [NotificationChannel.EMAIL]: { send: jest.fn(() => Promise.resolve()) },
    };
    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers
    );

    await usecase.sendNotification({
      userId: 'u2',
      companyId: 'c2',
      notificationType: 'happy-birthday',
    });

    const payload = queueAdd.mock.calls[0][1] as {
      channel: NotificationChannel;
      payload: { subject?: string; content?: string };
    };
    expect(payload.channel).toBe(NotificationChannel.EMAIL);
    expect(payload.payload?.subject).toBe('Happy Birthday John');
  });

  it('does not enqueue when both user and company unsubscribe', async () => {
    const repo = new NotificationRepositoryStub();
    const queueAdd = jest.fn<unknown, [string, any, any]>();
    const queue = { add: queueAdd } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub({
      [NotificationChannel.EMAIL]: false,
      [NotificationChannel.UI]: false,
    });
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub({
      [NotificationChannel.EMAIL]: false,
      [NotificationChannel.UI]: false,
    });
    const handlers: Record<NotificationChannel, NotificationSender> = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
      [NotificationChannel.EMAIL]: { send: jest.fn(() => Promise.resolve()) },
    };
    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers
    );

    await usecase.sendNotification({
      userId: 'u3',
      companyId: 'c3',
      notificationType: 'happy-birthday',
    });

    expect(queueAdd).not.toHaveBeenCalled();
  });

  it('does not enqueue when notification type is not found', async () => {
    const repo = new NotificationRepositoryStub();
    const queueAdd = jest.fn<unknown, [string, any, any]>();
    const queue = { add: queueAdd } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub();
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub();
    const handlers: Record<NotificationChannel, NotificationSender> = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
      [NotificationChannel.EMAIL]: { send: jest.fn(() => Promise.resolve()) },
    };
    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers
    );

    await usecase.sendNotification({
      userId: 'u4',
      companyId: 'c4',
      notificationType: 'unknown-type',
    });

    expect(queueAdd).not.toHaveBeenCalled();
  });

  it('processJob delegates to UI sender', async () => {
    const repo = new NotificationRepositoryStub();
    const queue = {
      add: jest.fn<unknown, [string, any, any]>(),
    } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub();
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub();
    const handlers: Record<NotificationChannel, NotificationSender> = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
      [NotificationChannel.EMAIL]: { send: jest.fn(() => Promise.resolve()) },
    };

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers,
    );

    const data = {
      userId: 'u5',
      companyId: 'c5',
      notificationType: 'happy-birthday',
      channel: NotificationChannel.UI,
      payload: { subject: 's', content: 'c' },
    } as const;

    await usecase.processJob(data as any);

    expect((handlers[NotificationChannel.UI] as any).send).toHaveBeenCalledWith(
      data,
    );
  });

  it('processJob delegates to EMAIL sender', async () => {
    const repo = new NotificationRepositoryStub();
    const queue = {
      add: jest.fn<unknown, [string, any, any]>(),
    } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub();
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub();
    const handlers: Record<NotificationChannel, NotificationSender> = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
      [NotificationChannel.EMAIL]: { send: jest.fn(() => Promise.resolve()) },
    };

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers,
    );

    const data = {
      userId: 'u6',
      companyId: 'c6',
      notificationType: 'happy-birthday',
      channel: NotificationChannel.EMAIL,
      payload: { subject: 's', content: 'c' },
    } as const;

    await usecase.processJob(data as any);

    expect(
      (handlers[NotificationChannel.EMAIL] as any).send,
    ).toHaveBeenCalledWith(data);
  });

  it('processJob no-ops when handler missing', async () => {
    const repo = new NotificationRepositoryStub();
    const queue = {
      add: jest.fn<unknown, [string, any, any]>(),
    } as unknown as Queue;
    const typeRepo = new NotificationTypeUseCaseStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub();
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub();
    const handlers = {
      [NotificationChannel.UI]: { send: jest.fn(() => Promise.resolve()) },
    } as unknown as Record<NotificationChannel, NotificationSender>;

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo as unknown as NotificationTypeUseCase,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
      handlers,
    );

    const data = {
      userId: 'u7',
      companyId: 'c7',
      notificationType: 'happy-birthday',
      channel: NotificationChannel.EMAIL,
      payload: { subject: 's', content: 'c' },
    } as const;

    await usecase.processJob(data as any);

    expect(
      (handlers[NotificationChannel.UI] as any).send,
    ).not.toHaveBeenCalled();
  });
});
