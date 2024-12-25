import { Injectable, UnauthorizedException } from "@nestjs/common";
import { loginDTO, UserDTO } from "src/user/user.dto";
import { UserService } from "src/user/user.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable({})
export class AuthService {
    constructor(
        private userservice: UserService,
        private jwtService: JwtService
    ) { }
    async signup(myobj: UserDTO): Promise<UserDTO> {
        return await this.userservice.addUser(myobj);
    }

    async signin(logindata: loginDTO): Promise<{ access_token: string }>{
        const user = await this.userservice.findOne(logindata);
        if (!user) {
            throw new UnauthorizedException();
        }
        const isMatch = await bcrypt.compare(logindata.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        const payload = logindata;
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}