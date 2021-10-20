import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { ChannelMember } from './channel-member.entity';
import { Exclude } from 'class-transformer';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ChannelType,
  })
  type: ChannelType;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channelId)
  channelMemberList: ChannelMember[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.type != ChannelType.PROTECTED) return;
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
