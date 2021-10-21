import { User } from 'src/user/entity/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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
  channelId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  userId: number;

  @Column({
    type: 'enum',
    enum: ChannelPenaltyType,
  })
  type: ChannelPenaltyType;

  @Column({ type: 'timestamp' })
  expired: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async initExpireDate(): Promise<void> {
    console.log('hello?');
    this.expired = new Date();
    this.expired.setHours(this.expired.getHours() + 2);
  }
}
