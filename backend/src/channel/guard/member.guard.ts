import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChannelService } from '../channel.service';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private readonly channelService: ChannelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const channelId = Number(request.params.channelId);
    const memberId = Number(request.params.memberId);

    if (!channelId || !memberId) return false;
    const result = await this.channelService.isJoinChannel(memberId, channelId);
    return result;
  }
}
