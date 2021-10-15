import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityDto } from './dto/community';
import { NotificationDto } from './dto/notification';
import { Block, Friend } from './entity/community.entity';
import { Notification } from './entity/notification.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async setRelationship(relationship: CommunityDto, isFriendly: boolean) {
    try {
      if (isFriendly) {
        await this.friendRepository.insert(
          this.friendRepository.create(relationship)
        );
        return await this.friendRepository.insert(
          this.friendRepository.create({
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
    if (isFriendly) {
      const blockList = await this.blockRepository.createQueryBuilder('block')
      .select("block.otherID")
      .where("block.userID = :userID", { userID: userID });

      return await this.friendRepository.createQueryBuilder('friend')
      .where("friend.userID = :userID", { userID: userID })
      .andWhere(`friend.otherID NOT IN (${blockList.getSql()})`)
      .leftJoinAndSelect("friend.other", "other")
      .orderBy("other.nickname", "ASC")
      .getMany();
    }
    else
      return await this.blockRepository.find({
        relations: ["other"],
        select: ["other"],
        where: { userID: userID }
      });
  }

  async getFriendByID(relationship: CommunityDto) {
    const result = await this.friendRepository.findOne({
      where: { userID: relationship.userID, otherID: relationship.otherID }
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async getBlockByID(relationship: CommunityDto) {
    const result = await this.blockRepository.findOne({
      where: { userID: relationship.userID, otherID: relationship.otherID }
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async deleteRelationshipByID(relationship: CommunityDto, isFriendly: boolean) {
    if (isFriendly) {
      await this.friendRepository.delete(relationship);
      return await this.friendRepository.delete({
        userID: relationship.otherID,
        otherID: relationship.userID
      });
    }
    else
      return await this.blockRepository.delete(relationship);
  }

  async getNotifications(userID: number) {
    return await this.notificationRepository.find({
      select: ["senderID", "type"],
      where: { receiverID: userID }
    });
  }

  async setNotification(notification: NotificationDto) {
    const result = await this.notificationRepository.findOne(notification);

    if (result) return null;
    try {
      return await this.notificationRepository.insert(
        this.notificationRepository.create(notification)
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async deleteNotification(notification: NotificationDto) {
    return await this.notificationRepository.delete(notification);
  }
}