import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from "../../user/entity/user.entity";

@Entity('relationship')
export class Relationship {
  @PrimaryColumn()
  userID: number;

  @PrimaryColumn()
  otherID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;

  @ManyToOne(() => User, other => other.relationships)
  @JoinColumn({ name: 'otherID' })
  other: User;

  @Column()
  isFriendly: boolean;
}