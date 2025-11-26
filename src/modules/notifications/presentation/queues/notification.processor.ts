import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationUseCase } from '@notifications/usecases/notification.usecase';
import { NotificationJobData } from '@notifications/dtos/notification.job.dto';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly notificationUseCase: NotificationUseCase) {
    super();
  }

  async process(job: Job<NotificationJobData>): Promise<void> {
    const data = job.data;
    await this.notificationUseCase.processJob(data);

    await job.updateProgress(100);
  }
}
