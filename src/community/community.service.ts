import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityDto } from './dto/community';
import { Block, Friend } from './entity/community.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Friend)
    private readonly frinedRepository: Repository<Friend>,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>
  ) {}

  async setRelationship(relationship: CommunityDto, isFriendly: boolean) {
    try {
      if (isFriendly) {
        await this.frinedRepository.insert(
          this.frinedRepository.create(relationship)
        );
        return await this.frinedRepository.insert(
          this.frinedRepository.create({
            userID: relationship.otherID,
            otherID: relationship.userID
        }));
      }
      else
        await this.blockRepository.insert(
          this.blockRepository.create(relationship)
        );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getRelationships(userID: number, isFriendly: boolean) {
    if (isFriendly)
      return await this.frinedRepository.find({
        relations: ["other"],
        where: { userID: userID }
      });
    else
      return await this.blockRepository.find({
        relations: ["other"],
        where: { userID: userID }
      });
  }

  async getRelationshipByID(relationship: CommunityDto) {
    const result = await this.frinedRepository.findOne({
      where: { userID: relationship.userID, otherID: relationship.otherID }
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async deleteRelationshipByID(relationship: CommunityDto, isFriendly: boolean) {
    if (isFriendly) {
      await this.frinedRepository.delete(relationship);
      return await this.frinedRepository.delete({
        userID: relationship.otherID,
        otherID: relationship.userID
      });
    }
    else
      return await this.blockRepository.delete(relationship);
  }
}