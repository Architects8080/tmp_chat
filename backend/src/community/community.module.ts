import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComunityController } from './community.controller';
import { ComunityService } from './community.service';
import { Relationship } from './entity/relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship])],
  controllers: [ComunityController],
  providers: [ComunityService]
})
export class ComunityModule {}
