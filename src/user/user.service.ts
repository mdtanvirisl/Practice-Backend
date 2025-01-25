import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
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

    async getUsersByusername(username: string): Promise<UserEntity> {
        return await this.userRepo.findOne({
            where: {
                username: username,
            },
            relations: ['role']
        });
    }

    async addUser(myobj: UserEntity): Promise<UserEntity> {
        
        return await this.userRepo.save(myobj);
    }
    async findOne(logindata: loginDTO): Promise<any> {
        // return await this.userRepo.findOneBy({ username: logindata.username });
        const query = this.userRepo.findOne({where: {username: logindata.username }, relations: ['role']});

        return query;
    }

    async getStaffs(): Promise<UserEntity[]> {
        return await this.userRepo.find({
            relations: ['role'], // Include the role relationship
        });
    }

    async searchStaff(name: string): Promise<UserEntity[]> {
        return await this.userRepo.find({
            where: {
                name: Like(name + '%')
            },
        });
    }

    async showProfile(username: string): Promise<UserEntity> {
        return await this.userRepo.findOne({where: { username }, relations: ['role']});
    }
    async updateProfile(username: string, UpdateInfo: UpdateDTO): Promise<any> {
        await this.userRepo.update({ username: username }, UpdateInfo);
        return await this.userRepo.findOneBy({ username: username });
    }

    async asigntask(taskinfo: TaskDTO, creator: any): Promise<any>{
        const { title, description, assignedTo } = taskinfo;

        const creatorid = await this.userRepo.findOneBy({username: creator});

        const assignees = await this.userRepo.find({where: {userid: In(assignedTo),},}); 

        const task = this.taskRepo.create({
            title,
            description,
            assignedTo: assignees,
            createdBy: creatorid,
        });
        return await this.taskRepo.save(task);
    }
    async getAllTasks(creator: string): Promise<TaskEntity[]> {
        return this.taskRepo.find({
            where: { createdBy: { username: creator } },
            relations: ["createdBy", "assignedTo"], // Include related entities
        });
    }

    async updateStutus(id: number, UpdateTaskStatusDTO: UpdateTaskStatusDTO): Promise<any>{
        await this.taskRepo.update({ id: id }, UpdateTaskStatusDTO);
        return await this.taskRepo.findOneBy({ id: id });
    }
}