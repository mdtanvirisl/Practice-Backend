import { Body, Controller, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Req, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateDTO } from "./user.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { TaskDTO, UpdateTaskStatusDTO } from "./task.dto";

@Controller('user')
export class UserController{
    constructor(private readonly userservice: UserService){}
    
    @UseGuards(AuthGuard)
    @Get('viewprofile')
    showProfile(@Session() session): object {
        try {
            return this.userservice.showProfile(session.username);
        }
        catch {
            throw new InternalServerErrorException("Failed to show profile");
        }
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

    @Post('/asigntask')
    asigntask(@Body() taskinfo: TaskDTO, @Session() session){
        const creator = session.username;
        console.log(session.username);
        // if (!session.username) {
        //     throw new UnauthorizedException('User is not logged in');
        // }
        // const Creator = this.userservice.findOne(session.username);
        return this.userservice.asigntask(taskinfo, creator);
    }

    @Post('/updatetask/stutus/:id')
    updateTask(@Param('id', ParseIntPipe) id: number, @Body() UpdateTaskStatusDTO: UpdateTaskStatusDTO){
        try {
            return this.userservice.updateStutus(id, UpdateTaskStatusDTO);
        }
        catch {
            throw new InternalServerErrorException("Failed to update profile");
        }
    }
}