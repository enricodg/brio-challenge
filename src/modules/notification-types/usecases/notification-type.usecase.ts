import { Inject, Injectable } from '@nestjs/common';
import { NotificationType } from '@notification-types/domains/notification-type';
import { NotificationTypeRepository } from '@notification-types/domains/interfaces/notification-type-repository.interface';

@Injectable()
export class NotificationTypeUseCase {
  constructor(
    @Inject(NotificationTypeRepository)
    private readonly repository: NotificationTypeRepository,
  ) {}

  async getByKey(key: string): Promise<NotificationType | null> {
    return this.repository.findByKey(key);
  }
}
