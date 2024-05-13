import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    name: 'created_by',
    type: 'int',
    nullable: true,
  })
  createdBy: number;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @Column({
    name: 'updated_by',
    type: 'int',
    nullable: true,
  })
  updatedBy: number;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @Column({
    name: 'deleted_by',
    type: 'int',
    nullable: true,
  })
  deletedBy?: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive?: boolean;
}
