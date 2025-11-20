import { NotificationProcessor } from '@notifications/presentation/queues/notification.processor';
import { NotificationChannel } from '@common/enums/notification-channel';
import { Model } from 'mongoose';
import { NotificationDocument } from '@notifications/infrastructure/persistence/notification.schema';

describe('NotificationProcessor', () => {
  type TestJob<T> = { data: T; updateProgress: jest.Mock };
  const makeJob = <T>(data: T): TestJob<T> => ({
    data,
    updateProgress: jest.fn(),
  });

  const makeModel = (): { create: jest.Mock } => ({
    create: jest.fn(),
  });

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => void 0);
    jest.spyOn(console, 'error').mockImplementation(() => void 0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('persists UI notifications', async () => {
    const model = makeModel();
    const processor = new NotificationProcessor(
      model as unknown as Model<NotificationDocument>,
    );
    const job = makeJob({
      userId: 'u1',
      companyId: 'c1',
      notificationType: 'happy-birthday',
      snapshot: {
        [NotificationChannel.UI]: { subject: 's', content: 'c' },
      } as unknown as Record<
        NotificationChannel,
        { subject?: string; content?: string }
      >,
    });

    await processor.process(job as any);

    expect(model.create).toHaveBeenCalledWith({
      userId: 'u1',
      channel: NotificationChannel.UI,
      subject: 's',
      content: 'c',
    });
    expect(console.log).not.toHaveBeenCalled();
    expect(job.updateProgress).toHaveBeenCalledWith(100);
  });

  it('logs EMAIL notifications', async () => {
    const model = makeModel();
    const processor = new NotificationProcessor(
      model as unknown as Model<NotificationDocument>,
    );
    const job = makeJob({
      userId: 'u2',
      companyId: 'c2',
      notificationType: 'happy-birthday',
      snapshot: {
        [NotificationChannel.EMAIL]: { subject: 'Subject', content: 'Body' },
      } as unknown as Record<
        NotificationChannel,
        { subject?: string; content?: string }
      >,
    });

    await processor.process(job as any);

    expect(model.create).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('email to u2 | Subject | Body');
    expect(job.updateProgress).toHaveBeenCalledWith(100);
  });

  it('handles both UI and EMAIL channels', async () => {
    const model = makeModel();
    const processor = new NotificationProcessor(
      model as unknown as Model<NotificationDocument>,
    );
    const job = makeJob({
      userId: 'u3',
      companyId: 'c3',
      notificationType: 'happy-birthday',
      snapshot: {
        [NotificationChannel.UI]: { subject: 'us', content: 'uc' },
        [NotificationChannel.EMAIL]: { subject: 'es', content: 'ec' },
      },
    });

    await processor.process(job as any);

    expect(model.create).toHaveBeenCalledWith({
      userId: 'u3',
      channel: NotificationChannel.UI,
      subject: 'us',
      content: 'uc',
    });
    expect(console.log).toHaveBeenCalledWith('email to u3 | es | ec');
    expect(job.updateProgress).toHaveBeenCalledWith(100);
  });

  it('skips when snapshot is empty', async () => {
    const model = makeModel();
    const processor = new NotificationProcessor(
      model as unknown as Model<NotificationDocument>,
    );
    const job = makeJob({
      userId: 'u4',
      companyId: 'c4',
      notificationType: 'happy-birthday',
      snapshot: {} as unknown as Record<
        NotificationChannel,
        { subject?: string; content?: string }
      >,
    });

    await processor.process(job as any);

    expect(model.create).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(job.updateProgress).toHaveBeenCalledWith(100);
  });

  it('throws and logs when UI persistence fails', async () => {
    const model = makeModel();
    model.create.mockRejectedValueOnce(new Error('db error'));
    const processor = new NotificationProcessor(
      model as unknown as Model<NotificationDocument>,
    );
    const job = makeJob({
      userId: 'u5',
      companyId: 'c5',
      notificationType: 'happy-birthday',
      snapshot: {
        [NotificationChannel.UI]: { subject: 's', content: 'c' },
      } as unknown as Record<
        NotificationChannel,
        { subject?: string; content?: string }
      >,
    });

    await expect(processor.process(job as unknown as any)).rejects.toThrow(
      'db error',
    );
    expect(console.error).toHaveBeenCalled();
  });
});
