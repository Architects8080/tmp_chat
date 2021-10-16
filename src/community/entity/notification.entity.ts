import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "../../user/entity/user.entity";

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderID: number;

  @Column()
  receiverID: number;

  //채널 초대: roomId
  //친구 요청: senderID
  @Column()
  targetID: number;

  @Column() //0: 친구초대 1: 채팅초대
  type: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderID'})
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverID' })
  receiver: User;
}