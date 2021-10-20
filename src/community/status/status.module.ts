import { Module } from '@nestjs/common';
import { CommunitySocketUserModule } from '../socket-user/community.socket-user.module';
import { StatusService } from './status.service';

@Module({
  imports: [CommunitySocketUserModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
