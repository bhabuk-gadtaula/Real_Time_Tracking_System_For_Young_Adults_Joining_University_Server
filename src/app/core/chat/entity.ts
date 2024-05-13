import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'chat' })
export class ChatEntity extends CommonEntity {
  @Column({
    name: 'message',
    nullable: false,
    type: 'varchar',
  })
  message: string;

  @Column({
    name: 'sender',
    nullable: false,
    type: 'varchar',
    length: 100,
  })
  sender: string;

  @Column({
    name: 'receiver',
    nullable: false,
    type: 'varchar',
    length: 100,
  })
  receiver: string;
}
