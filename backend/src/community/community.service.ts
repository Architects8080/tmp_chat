import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationshipDto } from './dto/relationship';
import { Relationship } from './entity/relationship.entity';

@Injectable()
export class ComunityService {
  constructor(
    @InjectRepository(Relationship)
    private readonly relationshipRepository: Repository<Relationship>
  ) {}

  async setRelationship(relationship: {userID: number, otherID: number}, isFriendly: boolean) {
    try {
      const newRelationship: RelationshipDto = {...relationship, isFriendly};
      return await this.relationshipRepository.insert(
        this.relationshipRepository.create(newRelationship)
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getRelationships(userID: number, mode: boolean) {
    return await this.relationshipRepository.find({
      relations: ["other"],
      where: {
        userID: userID,
        isFriendly: mode
      }
    });
  }

  async deleteRelationshipByID(userID: number, otherID: number) {
    return await this.relationshipRepository.delete({ userID: userID, otherID: otherID });
  }
}
