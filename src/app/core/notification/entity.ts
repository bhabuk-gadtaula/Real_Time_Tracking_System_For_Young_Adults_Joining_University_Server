import { Column, Entity } from 'typeorm';
import { ProjectModule } from '../../shared';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'notification' })
export class NotificationEntity extends CommonEntity {
  @Column({
    name: 'project_module',
    type: 'enum',
    nullable: false,
    enum: ProjectModule,
  })
  moduleName: ProjectModule;

  @Column({
    name: 'note',
    nullable: false,
    type: 'varchar',
    length: 200,
  })
  note: string;

  @Column({
    name: 'assigner',
    type: 'int',
    nullable: true,
  })
  assigner: number;
}
