import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '@notifications/infrastructure/persistence/notification.schema';
import { NotificationChannel } from '@common/enums/notification-channel';
import { NotificationJobData } from '@notifications/dtos/notification.job.dto';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  constructor(
    @InjectModel('Notification')
    private readonly model: Model<NotificationDocument>,
  ) {
    super();
  }

  async process(job: Job<NotificationJobData>): Promise<void> {
    const data = job.data;

    for (const [channel, payload] of Object.entries(data.snapshot)) {
      if (!payload) continue;
      if ((channel as NotificationChannel) === NotificationChannel.UI) {
        try {
          await this.model.create({
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
      if ((channel as NotificationChannel) === NotificationChannel.EMAIL) {
        console.log(
          `email to ${data.userId} | ${payload.subject ?? ''} | ${payload.content ?? ''}`,
        );
      }
    }

    await job.updateProgress(100);
  }
}
