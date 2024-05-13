import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'user_class_mapping' })
export class UserClassMappingEntity extends CommonEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'class_id',
    type: 'int',
    nullable: false,
  })
  classId: number;

  @Column({
    name: 'class_trigger_id',
    type: 'int',
    nullable: false,
  })
  classTriggerId: number;
}

@Entity({ name: 'class_trigger_time_mapping' })
export class ClassTimeMappingEntity extends CommonEntity {
  @Column({
    name: 'class_id',
    type: 'int',
    nullable: false,
  })
  classId: number;

  @Column({
    name: 'class_trigger_date_time',
    type: 'timestamp',
    nullable: false,
  })
  classTriggerDateTime: Date;
}
