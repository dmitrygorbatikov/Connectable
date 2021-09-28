import { Body, Controller, Get, Post, HttpStatus, Param, Response, Headers, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import {createQueryBuilder, getRepository} from "typeorm";
import {User} from "../user/user.entity";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/confirm-email')
  public async confirmEmail(@Body() body) {
    const user = await this.userService.getOneByEmail(body.email);
    if (user) {
      return {
        status: HttpStatus.BAD_GATEWAY,
        error: 'User is exist',
      };
    }

    const candidateConfirmEmail = await this.authService.findConfirmEmail(body.email);

    if (candidateConfirmEmail) {
      return {
        error: 'Вы уже отправляли письмо на почту',
        status: HttpStatus.BAD_GATEWAY,
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const rand = this.authService.getRandomNumber(100000, 999999);

    const mailOptions = {
      from: process.env.EMAIL,
      to: body.email,
      subject: 'Подтверждение регистрации',
      text: `Ваш код подтверждения: ${rand}`,
    };

    if(!(/^(?=.*[.])(?=.*[@]).{1,}/.test(body.email))){
        return {
          error: "Введите корректный email",
          status: HttpStatus.BAD_REQUEST
        }
    }

    let regularPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if(!regularPassword.test(body.password)){
      return{
        error:"Пароль должен содержать не менее 8 символов, хотя бы 1 цифру и 1 заглавную букву"
      }
    }

    const hashedPassword = await this.authService.passwordHash(body.password);

    await this.authService.createConfirmEmail({name: body.name, surname: body.surname, lastname: body.lastname, email: body.email, phone: body.phone, password: hashedPassword, code: rand});

    transporter.sendMail(mailOptions);

    return {
      status: HttpStatus.OK,
      message: 'Письмо было отправлено',
    };
  }  

  @Post('/register/:email')
  public async registerUser(@Param() params, @Body() body){
    const confirmEmail = await this.authService.findConfirmEmail(params.email)

    if(!confirmEmail){
      return {
        error:"Email не найден",
        status: HttpStatus.BAD_GATEWAY
      }
    }

    const isSuccessful = confirmEmail.code === body.code ? true : false;

    if (isSuccessful === false) {
      return {
        error: 'Неверный код',
        status: HttpStatus.BAD_GATEWAY,
      };
    }

    const createdUser = await this.userService.create({
      name: confirmEmail.name,
      surname: confirmEmail.surname,
      lastname: confirmEmail.lastname,
      email: confirmEmail.email,
      phone: confirmEmail.surname,
      password: confirmEmail.password,
    });

    const token = this.jwtService.sign({
      username: `${createdUser.name} ${createdUser.surname}`,
      userId: createdUser.id,
    });

    await this.authService.deleteConfirmEmail(confirmEmail.id);

    return {
      userId: createdUser.id,
      token,
      status: HttpStatus.OK,
    };
  }

  @Post('/login')
  public async loginUser(@Body() body, @Res({ passthrough: true }) res){
    const user = await this.userService.getOneByEmail(body.email);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }

    const isMatch = await this.authService.comparePassword(body.password, user.password);

    if (!isMatch) {
      return {
        error: 'Incorrect email or password',
        status: HttpStatus.BAD_GATEWAY,
      };
    }    

    const token = this.jwtService.sign({
      username: user.name,
      userId: user.id,
    });




    return {
      userId: user.id,
      token,
      status: HttpStatus.OK,
    };
  }
}