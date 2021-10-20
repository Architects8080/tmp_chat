import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelRoleService } from '../channel-role.service';
import { RoleDefaultList } from './roles.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly channelRoleService: ChannelRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 권한 목록 가져오기
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // 요청을 보낸 user 의 권한이 위 권한 array 에 있으면 true 반환
    const request = context.switchToHttp().getRequest();
    const result = await this.channelRoleService.getRole(
      request.params.channelId,
      request.user.id,
    );
    if (!roles.includes(result)) {
      return false;
    }
    return true;
  }
}
