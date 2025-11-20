import { Module } from '@nestjs/common';
import { UserService } from './user/user.service.interface';
import { UserServiceImpl } from './user/user.service';

@Module({
  providers: [{ provide: UserService, useClass: UserServiceImpl }],
  exports: [UserService],
})
export class ExternalModule {}
