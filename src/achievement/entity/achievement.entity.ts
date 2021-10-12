import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserAchievement } from "./user-achievement.entity";

@Entity('achievement')
export class Achievement {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;
}