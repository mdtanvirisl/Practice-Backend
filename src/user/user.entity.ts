import { RoleEntity } from "src/role/role.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    userid: number;

    @Column({ name: 'fullName', type: 'varchar', length: 150, update: true })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true, update: true })
    email: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'varchar', update: true })
    password: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: true })
    filename: string;

    @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
    role: RoleEntity;
}

