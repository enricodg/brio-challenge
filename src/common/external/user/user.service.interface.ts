import { UserSummary } from '@common/dtos/user/user.dto';

export abstract class UserService {
  abstract getUserCompanyProfile(
    userId: string,
    companyId: string,
  ): { user: UserSummary };
}
