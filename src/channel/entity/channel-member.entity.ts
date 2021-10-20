import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ChannelMessage } from './channel-message.entity';
import { Channel } from './channel.entity';

export enum MemberRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  OWNER = 'owner',
}

@Entity('channel_member')
export class ChannelMember {
  @ManyToOne(() => Channel, (channel) => channel.channelMemberList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;
  @PrimaryColumn()
  channelId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
  @PrimaryColumn()
  userId: number;

  @OneToMany(() => ChannelMessage, (message) => message.sentBy)
  messages: ChannelMessage[];

  @Column({
    type: 'enum',
    default: MemberRole.MEMBER,
    enum: MemberRole,
  })
  role: MemberRole;
}
