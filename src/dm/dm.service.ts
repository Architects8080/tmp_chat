import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { DirectMessageInfo } from './entity/dm.entity';
import { SendDMDto } from './dto/sendDM';

@Injectable()
export class DmService {
  constructor(
	  @InjectRepository(DirectMessageInfo)
    private readonly dmInfoRepository: Repository<DirectMessageInfo>,
  ) {}

  async sendDM(dm: SendDMDto) {
    const insertedId = await getConnection()
      .createQueryBuilder()
      .insert()
      .into("direct_message")
      .values({ message: dm.message })
      .returning(["dmID"])
      .execute();

    let newUserInfo: DirectMessageInfo = this.dmInfoRepository.create({
      dmID: insertedId.identifiers[0].dmID,
      userID: dm.userID,
      friendID: dm.friendID,
      isSender: true
    });

    let newFriendInfo: DirectMessageInfo = this.dmInfoRepository.create({
      dmID: insertedId.identifiers[0].dmID,
      userID: dm.friendID,
      friendID: dm.userID,
      isSender: false
    });

    try {
	    await this.dmInfoRepository.insert(newUserInfo);
	    await this.dmInfoRepository.insert(newFriendInfo);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getDMList(userID, friendID) {
    return await this.dmInfoRepository.find({
      where: {
        userID: userID,
        friendID: friendID
      },
      join: {
        alias: "DMInfo",
        leftJoinAndSelect: {
          dm: "DMInfo.dm",
        },
      },
      order: {
        timestamp: "ASC"
      }
    });
  }
}
