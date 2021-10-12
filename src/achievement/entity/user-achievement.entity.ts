import { User } from "src/user/entity/user.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Achievement } from "./achievement.entity";

@Entity('user_achievement')
export class UserAchievement {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @PrimaryColumn()
  userId: number;

  @ManyToOne(type => Achievement, achievement => achievement.id)
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;
  @PrimaryColumn()
  achievementId: number;
}