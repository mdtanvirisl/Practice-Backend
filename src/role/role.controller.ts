import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDTO } from "./role.dto";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post('/addrole')
    async createRole(@Body() createRoleDto: CreateRoleDTO) {
        return await this.roleService.createRole(createRoleDto);
    }

    @Get('/showrole')
    async getAllRoles() {
        return await this.roleService.getRoles();
    }

    @Get(':id')
    async getRoleById(@Param('id') id: number) {
        return await this.roleService.getRoleById(id);
    }
}
