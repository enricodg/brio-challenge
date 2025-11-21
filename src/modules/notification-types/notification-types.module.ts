import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationTypeSchema } from './infrastructure/persistence/notification-type.schema';
import { NotificationTypeRepositoryImpl } from './infrastructure/persistence/notification-type.repository';
import { NotificationTypeRepository } from '@notification-types/domains/interfaces/notification-type-repository.interface';
import { NotificationTypeUseCase } from './usecases/notification-type.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'NotificationType', schema: NotificationTypeSchema },
    ]),
  ],
  providers: [
    {
      provide: NotificationTypeRepository,
      useClass: NotificationTypeRepositoryImpl,
    },
    NotificationTypeUseCase,
  ],
  exports: [NotificationTypeUseCase],
})
export class NotificationTypesModule {}
