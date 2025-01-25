import { Body, Controller, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query, Req, Res, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateDTO } from "./user.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { TaskDTO, UpdateTaskStatusDTO } from "./task.dto";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { SessionGuard } from "src/auth/session.guard";

@Controller('user')
export class UserController{
    constructor(private readonly userservice: UserService){}
    
    @Roles('Admin', 'Manager')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Get('/all_staffs')
    getWarehouse(): object {
        try {
            return this.userservice.getStaffs();
        }
        catch {
            return { error: 'invalid' };
        }
    }
    // @UseGuards(AuthGuard)
    @Get('getusers/:username')
    getUsersByEmail(@Param('username') username: string): object {
        return this.userservice.getUsersByusername(username);
    }

    @UseGuards(SessionGuard)
    @UseGuards(AuthGuard)
    @Get('viewprofile')
    showProfile(@Session() session): object {
        try {
            // console.log(session.username);
            return this.userservice.showProfile(session.username);
        }
        catch {
            throw new InternalServerErrorException("Failed to show profile");
        }
    }

    @Get('/getimage/:name')
    getImages(@Param('name') name: string, @Res() res) {
        res.sendFile(name, { root: './upload' })
    }
    
    @UseGuards(AuthGuard)
    @Put('/update_profile/:username')
    updateProfile(@Param('username') username: string, @Body() UpdateInfo: UpdateDTO): object {
        try {
            return this.userservice.updateProfile(username, UpdateInfo);
        }
        catch {
            throw new InternalServerErrorException("Failed to update profile");
        }

    }

    @Roles('Manager')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Post('/asigntask')
    asigntask(@Body() taskinfo: TaskDTO, @Session() session){
        const creator = session.username;
        return this.userservice.asigntask(taskinfo, creator);
    }

    @Roles('Manager')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Post('/updatetask/stutus/:id')
    updateTask(@Param('id', ParseIntPipe) id: number, @Body() UpdateTaskStatusDTO: UpdateTaskStatusDTO){
        try {
            return this.userservice.updateStutus(id, UpdateTaskStatusDTO);
        }
        catch {
            throw new InternalServerErrorException("Failed to update profile");
        }
    }


    @Get('/alltasks')
    async showAllTasks(@Session() session) {
        const creator = session.username;
        return this.userservice.getAllTasks(creator);
    }

    @Get('/search_staff')
    searchCustomer(@Query() query: { name: string }): object {
        const { name } = query;
        try {
            return this.userservice.searchStaff(name);
        }
        catch {
            throw new InternalServerErrorException("Failed to search");
        }
    }
}