import { Body, Controller, Get, InternalServerErrorException, Param, Put, Session, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateDTO } from "./user.dto";
import { AuthGuard } from "src/auth/auth.guard";

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
}