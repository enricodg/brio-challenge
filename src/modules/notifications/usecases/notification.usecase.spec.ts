import { Queue } from 'bullmq';
import { NotificationUseCase } from './notification.usecase';
import { NotificationRepository } from '@notifications/domains/interfaces/notification.repository.interface';
import { NotificationTypeRepository } from '@notification-types/domains/interfaces/notification-type-repository.interface';
import { NotificationChannel } from '@common/enums/notification-channel';
import { UserSubscriptionSettingsUseCase } from '@subscriptions/usecases/user-subscription-settings.usecase';
import { CompanySubscriptionSettingsUseCase } from '@subscriptions/usecases/company-subscription-settings.usecase';
import { UserService } from '@common/external/user/user.service.interface';
import {
  NotificationType,
  ChannelTemplates,
} from '@notification-types/domains/notification-type';
import { UserSummary } from '@common/dtos/user/user.dto';

class NotificationRepositoryStub implements NotificationRepository {
  findByUserIdAndChannel = jest.fn();
  findByUserIdAndChannelPaged = jest.fn();
  create = jest.fn();
}

class NotificationTypeRepositoryStub implements NotificationTypeRepository {
  findByKey = jest.fn((key: string): Promise<NotificationType | null> => {
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
    const typeRepo = new NotificationTypeRepositoryStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub(
      { [NotificationChannel.EMAIL]: false, [NotificationChannel.UI]: true },
    );
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub(
      { [NotificationChannel.EMAIL]: true, [NotificationChannel.UI]: true },
    );

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
    );

    await usecase.sendNotification({
      userId: 'u1',
      companyId: 'c1',
      notificationType: 'happy-birthday',
    });

    expect(queueAdd.mock.calls.length).toBe(1);
    expect(queueAdd.mock.calls[0][0]).toBe('send');
    const payload = queueAdd.mock.calls[0][1] as {
      snapshot: Record<
        NotificationChannel,
        { subject?: string; content?: string }
      >;
    };
    expect(Object.keys(payload.snapshot)).toEqual([NotificationChannel.UI]);
    expect(payload.snapshot[NotificationChannel.UI]?.content).toBe(
      'Happy Birthday John',
    );
  });

  it('keeps EMAIL only when company unsubscribes UI', async () => {
    const repo = new NotificationRepositoryStub();
    const queueAdd = jest.fn<unknown, [string, any, any]>();
    const queue = { add: queueAdd } as unknown as Queue;
    const typeRepo = new NotificationTypeRepositoryStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub(
      { [NotificationChannel.EMAIL]: true, [NotificationChannel.UI]: true },
    );
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub(
      { [NotificationChannel.EMAIL]: true, [NotificationChannel.UI]: false },
    );

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
    );

    await usecase.sendNotification({
      userId: 'u2',
      companyId: 'c2',
      notificationType: 'happy-birthday',
    });

    const payload = queueAdd.mock.calls[0][1] as {
      snapshot: Record<
        NotificationChannel,
        { subject?: string; content?: string }
      >;
    };
    expect(Object.keys(payload.snapshot)).toEqual([NotificationChannel.EMAIL]);
    expect(payload.snapshot[NotificationChannel.EMAIL]?.subject).toBe(
      'Happy Birthday John',
    );
  });

  it('does not enqueue when both user and company unsubscribe', async () => {
    const repo = new NotificationRepositoryStub();
    const queueAdd = jest.fn<unknown, [string, any, any]>();
    const queue = { add: queueAdd } as unknown as Queue;
    const typeRepo = new NotificationTypeRepositoryStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub(
      { [NotificationChannel.EMAIL]: false, [NotificationChannel.UI]: false },
    );
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub(
      { [NotificationChannel.EMAIL]: false, [NotificationChannel.UI]: false },
    );

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
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
    const typeRepo = new NotificationTypeRepositoryStub();
    const userSvc = new UserServiceStub();
    const userSubsUseCase = new UserSubscriptionSettingsUseCaseStub();
    const companySubsUseCase = new CompanySubscriptionSettingsUseCaseStub();

    const usecase = new NotificationUseCase(
      repo as unknown as NotificationRepository,
      queue,
      typeRepo,
      userSvc,
      userSubsUseCase as unknown as UserSubscriptionSettingsUseCase,
      companySubsUseCase as unknown as CompanySubscriptionSettingsUseCase,
    );

    await usecase.sendNotification({
      userId: 'u4',
      companyId: 'c4',
      notificationType: 'unknown-type',
    });

    expect(queueAdd).not.toHaveBeenCalled();
  });
});
