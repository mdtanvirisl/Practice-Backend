import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { loginDTO, UpdateDTO } from "./user.dto";

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
        private jwtService: JwtService

    ) { }
    async addUser(myobj: UserEntity): Promise<UserEntity> {
        return await this.userRepo.save(myobj);
    }
    async findOne(logindata: loginDTO): Promise<any> {
        return await this.userRepo.findOneBy({ email: logindata.email });
    }

    async showProfile(username: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ username: username });
    }
    async updateProfile(username: string, UpdateInfo: UpdateDTO): Promise<any> {
        await this.userRepo.update({ username: username }, UpdateInfo);
        return await this.userRepo.findOneBy({ username: username });
    }
}