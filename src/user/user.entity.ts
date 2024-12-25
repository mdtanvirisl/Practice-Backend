import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    userid: string;

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
}
