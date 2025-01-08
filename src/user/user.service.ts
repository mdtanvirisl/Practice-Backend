import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { loginDTO, UpdateDTO } from "./user.dto";
import { TaskDTO, UpdateTaskStatusDTO } from "./task.dto";
import { TaskEntity } from "./task.entity";

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,

    @InjectRepository(TaskEntity)
    private taskRepo: Repository<TaskEntity>,
        
        
    ) { }

    async addUser(myobj: UserEntity): Promise<UserEntity> {
        
        return await this.userRepo.save(myobj);
    }
    async findOne(logindata: loginDTO): Promise<any> {
        return await this.userRepo.findOneBy({ username: logindata.username });
    }

    async showProfile(username: string): Promise<UserEntity> {
        return await this.userRepo.findOne({where: { username }, relations: ['role']});
    }
    async updateProfile(username: string, UpdateInfo: UpdateDTO): Promise<any> {
        await this.userRepo.update({ username: username }, UpdateInfo);
        return await this.userRepo.findOneBy({ username: username });
    }

    async asigntask(taskinfo: TaskDTO, creator: UserEntity): Promise<any>{
        const { title, description, assignedTo } = taskinfo;

        const creatorid = await this.userRepo.findOneBy(creator);

        const assignees = await this.userRepo.find({where: {userid: In(assignedTo),},}); 

        const task = this.taskRepo.create({
            title,
            description,
            assignedTo: assignees,
            createdBy: creatorid,
        });
        return await this.taskRepo.save(task);
    }

    async updateStutus(id: number, UpdateTaskStatusDTO: UpdateTaskStatusDTO): Promise<any>{
        await this.taskRepo.update({ id: id }, UpdateTaskStatusDTO);
        return await this.taskRepo.findOneBy({ id: id });
    }
}