import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  type: number;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channelID)
  channelIDs: ChannelMember[];
}

@Entity('channel_member')
export class ChannelMember {
  @ManyToOne(() => Channel, (channel) => channel.channelIDs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'channelID' })
  channel: Channel;
  @PrimaryColumn()
  channelID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;
  @PrimaryColumn()
  userID: number;

  @OneToMany(() => ChannelMessage, (message) => message.sentBy)
  messages: ChannelMessage[];

  @Column()
  permissionType: number;

  @Column()
  penalty: number;
}

@Entity('channel_message')
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChannelMember, (message) => message.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'cid', referencedColumnName: 'channelID' },
    { name: 'uid', referencedColumnName: 'userID' },
  ])
  sentBy: ChannelMember;

  @Column()
  message: string;

  @Column()
  timestamp: Date;
}
