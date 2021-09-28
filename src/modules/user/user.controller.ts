import { Body, Controller, Delete, Get, Headers, Post, Put, Query } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';
import * as nodemailer from 'nodemailer';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService){}

    @Get()
    public async getAllUsers(@Headers() headers){
        try{
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                }
            }

            const users = getRepository(User).find({where: [
                {role: 'user'},
                {role: 'manager'},
            ]})

            return {
                users
            }

        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Get('/profile/admin')
    public async getUserProfileByAdmin(@Headers() headers, @Query() query){
        try{
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                }
            }

            const user = await this.userService.getOneById(query.id)

            if(!user){
                return {
                    error: "Пользователь не найден"
                }
            }

            return {
                user
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Get('/profile')
    public async getProfile(@Headers() headers){
        try{
        const token = headers.token

        const isAuth = await this.authService.checkUser(token)
        if(!isAuth){
            return {
                error: "Нет авторизации",
            }
        }

        const decode = this.authService.getIdByToken(token)

        const user = await this.userService.getOneById(decode.userId)

        if(!user){
            return {
                error: "Пользователь не найден"
            }
        }

        return {
            user
        }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Delete('/profile')
    public async deleteProfile(@Headers() headers){
        try{
            const token = headers.token
    
            const isAuth = await this.authService.checkUser(token)
    
            if(!isAuth){
                return {
                    error: "Нет авторизации",
                }
            }
    
            const decode = this.authService.getIdByToken(token)
    
            const user = await this.userService.getOneById(decode.userId)
    
            if(!user){
                return {
                    error: "Пользователь не найден"
                }
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD,
                },
              });

            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Удаление аккаунта',
                text: `Вы удалили свой аккаунт`,
            });

            await this.userService.deleteUserById(decode.userId)
    
            return {
                message: "Пользователь удалён"
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Delete('/profile/admin')
    public async deleteUserByAdmin(@Headers() headers, @Query() query){
        try{
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                }
            }

            const user = await this.userService.getOneById(query.id)

            if(!user){
                return {
                    error: "Пользователь не найден"
                }
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD,
                },
              });

            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Удаление аккаунта',
                text: `Ваш аккаунт был удалён администратором Connectable`,
            });

            await this.userService.deleteUserById(query.id)

            return {
                message: "User deleted"
            }

        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Put()
    public async updateProfile(@Headers() headers, @Body() body){
        try{
            const token = headers.token
    
            const isAuth = await this.authService.checkUser(token)
    
            if(!isAuth){
                return {
                    error: "Нет авторизации",
                }
            }
    
            const decode = this.authService.getIdByToken(token)
    
            const userByEmail = await this.userService.getOneById(decode.userId)
    
            if(!userByEmail){
                return {
                    error: "Пользователь не найден"
                }
            }

            const userByPhone = await this.userService.getOneByPhone(body.phone)
            if(userByPhone && userByPhone === decode.userId){
                return {
                    error:"Пользователь с таким телефоном уже зарегестрирован"
                }
            }

            await this.userService.updateProfile(decode.userId, body)

            return {
                message: "Данные обновлены"
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Post()
    public async createUserByAdmin(@Headers() headers, @Body() body){
        try {
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                }
            }

            const candidate = await this.userService.getOneByEmail(body.email)
            if(candidate){
                return {
                    error: "Такой пользователь уже существует"
                }
            }

            const hashedPassword = await this.authService.passwordHash(body.password);

            const user = await this.userService.create({
                email: body.email,
                password: hashedPassword,
                role: body.role
            })

            return {
                user
            }            
        } catch (e) {
            return {
                error: e
            }
        }
    }


}
