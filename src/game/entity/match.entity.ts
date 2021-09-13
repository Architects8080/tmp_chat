import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameType: number; // enum

  @ManyToOne((type) => User)
  winner: number;
  @ManyToOne((type) => User)
  loser: number;

  @Column()
  winnerScore: number;
  @Column()
  loserScore: number;

  @Column()
  gameTime: number; // second
}
