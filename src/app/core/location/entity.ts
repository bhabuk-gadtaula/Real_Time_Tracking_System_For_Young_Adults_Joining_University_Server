import { Column, Entity } from 'typeorm';
import { ProjectModule } from '../../shared';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'locations' })
export class LocationEntity extends CommonEntity {
  @Column({
    name: 'source_long',
    type: 'numeric', // or 'decimal'
    precision: 9, // total number of digits
    scale: 6, // number of digits to the right of the decimal point
    nullable: false,
  })
  sourceLong: number;

  @Column({
    name: 'source_lat',
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: false,
  })
  sourceLat: number;

  @Column({
    name: 'dest_long',
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  destLong?: number;

  @Column({
    name: 'dest_lat',
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: true,
  })
  destLat?: number;

  @Column({
    name: 'reference_id',
    type: 'int',
    nullable: false,
  })
  referenceId: number;

  @Column({
    name: 'project_module',
    type: 'enum',
    nullable: false,
    enum: ProjectModule,
  })
  moduleName: ProjectModule;

  @Column({
    name: 'user_parent_id',
    nullable: false,
    type: 'integer',
  })
  userParentId: number;
}
