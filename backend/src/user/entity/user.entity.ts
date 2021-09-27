import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { ChannelMember } from 'src/channel/entity/channel.entity';

@Entity('user')
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 255 })
  nickname: string;

  @Column({ nullable: false, unique: true, length: 255 })
  intraLogin: string;

  @Column()
  avatar: string;

  @Column({ default: 0 })
  status: number;

  @Column({ default: false })
  useTwoFactor: boolean;

  @Column({ default: 0 })
  ladderPoint: number;

  @Column({ default: 0 })
  ladderLevel: number;
}
