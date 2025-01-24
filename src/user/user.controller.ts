import { Body, Controller, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Req, Res, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
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

    @UseGuards(AuthGuard)
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
        console.log(session.username);
        // if (!session.username) {
        //     throw new UnauthorizedException('User is not logged in');
        // }
        // const Creator = this.userservice.findOne(session.username);
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
}