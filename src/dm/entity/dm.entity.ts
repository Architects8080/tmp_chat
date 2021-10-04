import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { User } from "../../user/entity/user.entity";

@Entity('direct_message')
export class DirectMessage {
  @PrimaryGeneratedColumn()
  dmID: number;

  @Column({ nullable: false, length: 255 })
  message: string;

  @OneToMany(() => DirectMessageInfo, dmInfo => dmInfo.dm)
  dmInfo: DirectMessageInfo[];
}

@Entity('direct_message_info')
export class DirectMessageInfo {
  @ManyToOne(() => DirectMessage, dm => dm.dmInfo)
  @JoinColumn({ name: 'dmID' })
  dm: DirectMessage;
  @Column({ primary: true, })
  dmID: number;

  @ManyToOne(() => User, userID => userID.id)
  @JoinColumn({ name: 'userID' })
  user: User;
  @Column({ primary: true, })
  userID: number;

  @ManyToOne(() => User, friendID => friendID.id)
  @JoinColumn({ name: 'friendID' })
  friend: User;
  @Column({ primary: true, })
  friendID: number;

  @Column({ nullable: false })
  isSender: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
  timestamp: Date;
}