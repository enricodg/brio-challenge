import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Notification } from '@notifications/domains/notification';
import { NotificationSendDto } from '@notifications/dtos/notification.send.dto';
import { NotificationUseCase } from '@notifications/usecases/notification.usecase';

@Controller('/notifications')
export class NotificationsController {
  constructor(private readonly notificationUseCase: NotificationUseCase) {}

  @Get(':userId')
  async list(
    @Param('userId') userId: string,
    @Query('page') pageParam?: number,
    @Query('limit') limitParam?: number,
  ): Promise<{
    data: Notification[];
    meta: { page: number; limit: number; total: number };
  }> {
    // This can be moved to common utils if needed to be reused
    const page = Math.max(1, pageParam ?? 1);
    const limit = Math.max(1, Math.min(100, limitParam ?? 20));
    const { items, total } =
      await this.notificationUseCase.getNotificationByUserId(
        userId,
        page,
        limit,
      );
    return { data: items, meta: { page, limit, total } };
  }

  @Post()
  async send(
    @Body() body: NotificationSendDto,
  ): Promise<{ data: { success: boolean } }> {
    const success = await this.notificationUseCase.sendNotification(body);
    return {
      data: {
        success: success,
      },
    };
  }
}
