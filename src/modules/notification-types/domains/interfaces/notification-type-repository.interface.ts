import { NotificationType } from '../../domains/notification-type';

export interface NotificationTypeRepository {
  findByKey(key: string): Promise<NotificationType | null>;
}
