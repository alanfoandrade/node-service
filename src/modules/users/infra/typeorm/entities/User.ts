import uploadConfig from '@config/upload';
import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import UserToken from './UserToken';

@Entity('users')
class User {
  @Column('varchar', { nullable: true })
  avatar?: string | null;

  @Column('varchar', { nullable: true })
  bio?: string;

  @Column('boolean', { default: true })
  confirmPending: boolean;

  @Column('varchar')
  cpf: string;

  @CreateDateColumn('timestamp with time zone')
  createdAt: Date;

  @Column('varchar')
  email: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  @Exclude()
  password: string;

  @Column('varchar', { nullable: true })
  phone?: string;

  @OneToMany(() => UserToken, (userToken) => userToken.user, {
    cascade: true,
  })
  tokens: UserToken[];

  @UpdateDateColumn('timestamp with time zone')
  updatedAt: Date;

  @Expose({ name: 'avatarUrl' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.API_URL}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.s3.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
