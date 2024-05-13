import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'class' })
export class ClassEntity extends CommonEntity {
  @Column({
    name: 'name',
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    name: 'user_parent_id',
    nullable: false,
    type: 'integer',
  })
  userParentId: number;
}
