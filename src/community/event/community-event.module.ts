import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CommunityEventService } from './community-event.service';
import { StatusModule } from '../status/status.module';
import { CommunitySocketUserModule } from '../socket-user/community.socket-user.module';

@Module({
  imports: [StatusModule, UserModule, CommunitySocketUserModule],
  providers: [CommunityEventService],
  exports: [CommunityEventService],
})
export class CommunityEventModule {}
