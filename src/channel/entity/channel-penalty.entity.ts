import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

export enum ChannelPenaltyType {
  MUTE = 'mute',
  BAN = 'ban',
}

@Entity('channel_penalty')
export class ChannelPenalty {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  @PrimaryColumn()
  channelId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  @PrimaryColumn()
  userId: number;

  @Column({
    type: 'enum',
    enum: ChannelPenaltyType,
  })
  level: ChannelPenaltyType;

  @Column({
    type: 'date',
    default: () => 'now()',
  })
  expired: Date;
}
