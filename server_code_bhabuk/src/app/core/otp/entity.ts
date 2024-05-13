import { Scope } from './interface';
import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../../shared/base/entity';

@Entity({ name: 'otps' })
export class OtpEntity extends CommonEntity {
  @Column({
    name: 'otp',
    type: 'varchar',
    length: 6,
    nullable: false,
  })
  otp: string;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'revoked',
    type: 'boolean',
    default: false,
  })
  revoked?: boolean;

  @Column({
    name: 'scope',
    type: 'enum',
    enum: Scope,
  })
  scope: Scope;
}
