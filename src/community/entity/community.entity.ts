import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from "../../user/entity/user.entity";

@Entity('friend')
export class Friend {
  @PrimaryColumn()
  userID: number;

  @PrimaryColumn()
  otherID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;

  @ManyToOne(() => User, other => other.friendList)
  @JoinColumn({ name: 'otherID' })
  other: User;
}

@Entity('block')
export class Block {
  @PrimaryColumn()
  userID: number;

  @PrimaryColumn()
  otherID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;

  @ManyToOne(() => User, other => other.blockList)
  @JoinColumn({ name: 'otherID' })
  other: User;
}