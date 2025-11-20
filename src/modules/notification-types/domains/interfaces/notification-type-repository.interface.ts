import { NotificationType } from '../../domains/notification-type';

export abstract class NotificationTypeRepository {
  abstract findByKey(key: string): Promise<NotificationType | null>;
}
