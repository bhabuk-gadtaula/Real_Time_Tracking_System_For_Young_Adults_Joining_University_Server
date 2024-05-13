import { Entity, Column } from 'typeorm';
import { UserRole, UserStatus } from './interface';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'users' })
export class UsersEntity extends CommonEntity {
  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'middle_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  middleName?: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone?: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status?: UserStatus;

  @Column({
    name: 'role',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;

  @Column({
    name: 'ancestor_id',
    type: 'int',
    nullable: true,
  })
  ancestorId?: number;
}
