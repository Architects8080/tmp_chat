import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityEventModule } from 'src/community/event/community-event.module';
import { Friend } from 'src/friend/entity/friend.entity';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from './entity/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Block, Friend]), CommunityEventModule],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
