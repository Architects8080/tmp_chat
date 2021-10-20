import { Module } from '@nestjs/common';
import { CommunitySocketUserService } from './community.socket-user.service';

@Module({
  providers: [CommunitySocketUserService],
  exports: [CommunitySocketUserService],
})
export class CommunitySocketUserModule {}
