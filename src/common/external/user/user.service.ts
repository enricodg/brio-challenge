import { Injectable } from '@nestjs/common';
import { UserService } from '@common/external/user/user.service.interface';
import { UserSummary } from '@common/dtos/user/user.dto';

@Injectable()
export class UserServiceImpl implements UserService {
  getUserCompanyProfile(
    _userId: string,
    _companyId: string,
  ): { user: UserSummary } {
    void _userId;
    void _companyId;
    return {
      user: {
        firstName: 'Enrico',
        companyName: 'Brio',
      },
    };
  }
}
