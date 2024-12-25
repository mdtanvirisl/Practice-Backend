import { Body, Controller, HttpException, HttpStatus, Post, Req, Session, UnauthorizedException, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginDTO, UserDTO } from "src/user/user.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController{
    constructor(private authservice: AuthService){}

    @Post('signup')
    @UseInterceptors(FileInterceptor('myfile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 600000 },
            storage: diskStorage({
                destination: './upload',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
    async addUser(@Body() myobj: UserDTO, @UploadedFile() myfile: Express.Multer.File): Promise<UserDTO> {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(myobj.password, salt);
        myobj.password = hashedpassword;
        myobj.filename = myfile.filename;
        return this.authservice.signup(myobj);
    }

    @Post('signin')
    @UsePipes(new ValidationPipe)
    async signin(@Body() logindata: loginDTO, @Session() session) {

        const result = await this.authservice.signin(logindata);
        if (result) {
            session.email = logindata.email;
            console.log(session.email);

            return result;
        }
        else {
            throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post('/signout')
    signout(@Req() req) {
        if (req.session.destroy()) {
            return true;
        }
        else {
            throw new UnauthorizedException("invalid actions");
        }

    }
}