import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column({ nullable: true, default: null })
  otpSecret: string;

  @Column({ default: 0 })
  ladderPoint: number;

  @Column({ default: 0 })
  ladderLevel: number;
}
