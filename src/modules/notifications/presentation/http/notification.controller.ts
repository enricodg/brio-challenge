import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Notification } from '@notifications/domains/notification';
import { NotificationSendDto } from '@notifications/dtos/notification.send.dto';
import { NotificationUseCase } from '@notifications/usecases/notification.usecase';

@Controller('/notifications')
export class NotificationsController {
  constructor(private readonly notificationUseCase: NotificationUseCase) {}

  @Get(':userId')
  async list(
    @Param('userId') userId: string,
  ): Promise<{ data: Notification[] }> {
    const items =
      await this.notificationUseCase.getNotificationByUserId(userId);
    return { data: items };
  }

  @Post()
  async send(@Body() body: NotificationSendDto): Promise<{ message: string }> {
    await this.notificationUseCase.sendNotification(body);
    return { message: 'Notification sent' };
  }
}
