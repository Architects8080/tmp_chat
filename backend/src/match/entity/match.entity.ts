import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchPlayer } from './match-player.entity';

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameType: number; // enum
  @Column()
  startAt: Date;
  @Column()
  endAt: Date;
  @Column()
  gameTime: number; // second

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match)
  @JoinColumn()
  players: MatchPlayer[];
}
