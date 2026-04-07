import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isAuthValid = await super.canActivate(context);
    if (!isAuthValid) {
      return false;
    }

    return true;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }

    // SuperAdmin has access to everything
    if (user.role === UserRole.SUPER_ADMIN) {
      return user;
    }
    // Return user with role and permissions
    return user;
  }
}
