import { Body, Controller, Get, InternalServerErrorException, Param, Post, Put, Req, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateDTO } from "./user.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { TaskDTO } from "./task.dto";

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
    async asigntask(@Body() taskinfo: TaskDTO, @Req() req){
        const creator = req.user; 
        // console.log('Session Data:', session);
        // if (!session.username) {
        //     throw new UnauthorizedException('User is not logged in');
        // }
        // const taskCreator = await this.userservice.findOne(session.username);
        return await this.userservice.asigntask(taskinfo, creator);
    }
}