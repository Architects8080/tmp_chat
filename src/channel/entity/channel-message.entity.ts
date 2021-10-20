import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelMember } from './channel-member.entity';

@Entity('channel_message')
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChannelMember, (message) => message.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'cid', referencedColumnName: 'channelId' },
    { name: 'uid', referencedColumnName: 'userId' },
  ])
  sentBy: ChannelMember;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
