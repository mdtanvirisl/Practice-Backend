import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [ TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
        global: true,
        secret: "3NP_Backend_Warehouse",
        signOptions: { expiresIn: '30m' },
    }),forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
