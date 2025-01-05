import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "./role.entity";
import { CreateRoleDTO } from "./role.dto";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepo: Repository<RoleEntity>
    ) {}

    async createRole(roleDto: CreateRoleDTO): Promise<RoleEntity> {
        // const role = this.roleRepo.create(roleDto);
        return await this.roleRepo.save(roleDto);
    }

    async getRoles(): Promise<RoleEntity[]> {
        return await this.roleRepo.find();
    }

    async getRoleById(id: number): Promise<RoleEntity> {
        return await this.roleRepo.findOne({ where: { id } });
    }
}
