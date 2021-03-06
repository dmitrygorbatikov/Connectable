import { Body, Controller, Post, Headers, HttpStatus, Get, Put, Query } from '@nestjs/common';
import { getRepository, Like} from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import * as nodemailer from 'nodemailer';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService, private authService: AuthService, private userService: UserService){}

    @Post()
    public async createOrder(@Body() body, @Headers() headers){
        try{   

            const token = headers.token

            const isAuth = await this.authService.checkUser(token)

            if(!isAuth){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const number = this.authService.getRandomNumber(100000000, 999999999)

            const decode = this.authService.getIdByToken(token)

            const user = await this.userService.getOneById(decode.userId)

            if(body.sendToEmail === user.email){
                return {
                    error: "Нельзя указать адрес получателя как свой"
                }
            }

            const order = await this.orderService.createOrder({
                number,
                title: body.title,
                cost: body.cost,
                sendAddress: body.sendAddress,
                recipientAddress:body.recipientAddress,
                deliveryCost: body.weight <= 1 ? 40 : body.weight > 1 && body.weight <= 5 ? 80 : 120,
                weight:body.weight,
                height:body.height,
                width: body.width,
                sendToEmail: body.sendToEmail,
                userId: user.id,
                latitude: body.latitude,
                longtitude: body.longtitude
            })

            return {
                order
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Put()
    public async accessOrder(@Headers() headers, @Query() query){
        try{
            const token = headers.token

            const isManager = await this.authService.checkManeger(token)

            if(!isManager){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const order = await this.orderService.getById(query.id)
            if(!order){
                return {
                    error: "Заказ не найден"
                }
            }
            const user = await this.userService.getOneById(order.userId)


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            transporter.sendMail({
                from: process.env.EMAIL,
                to: order.sendToEmail,
                subject: 'Connectable',
                text: `Поислка вiд ${user.name} ${user.surname} ${user.lastname} буда пiдтверджена та буде вiдправлена найближчим часом`,
            });
            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Connectable',
                text: `Ваша посилка була пiдтверджена та буде вiдправлена найближчим часом`,
            });

            await this.orderService.confirmOrder(query.id, {
                status: "Підтверджено"
            })

            return {
                status: "Підтверджено"
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Put('/send')
    public async sendOrder(@Headers() headers, @Query() query){
        try{
            const token = headers.token

            const isManager = await this.authService.checkManeger(token)

            if(!isManager){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const order = await this.orderService.getById(query.id)
            if(!order){
                return {
                    error: "Заказ не найден"
                }
            }
            const user = await this.userService.getOneById(order.userId)

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            transporter.sendMail({
                from: process.env.EMAIL,
                to: order.sendToEmail,
                subject: 'Connectable',
                text: `Посилка ${user.name} ${user.surname} ${user.lastname} вiдправлена та найближчим часом будет доставлена`,
            });
            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Connectable',
                text: `Ваша посилка вiдправлена та найближчим часом буде вiдправлена`,
            });

            await this.orderService.confirmOrder(query.id, {
                status: "Відправлено"
            })

            return {
                status: "Відправлено"
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Put('/delivered')
    public async deliveredOrder(@Headers() headers, @Query() query){
        try{
            const token = headers.token

            const isManager = await this.authService.checkManeger(token)

            if(!isManager){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const order = await this.orderService.getById(query.id)
            if(!order){
                return {
                    error: "Заказ не найден"
                }
            }

            const user = await this.userService.getOneById(order.userId)

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            transporter.sendMail({
                from: process.env.EMAIL,
                to: order.sendToEmail,
                subject: 'Connectable',
                text: `Посилка вiд ${user.name} ${user.surname} ${user.lastname} доставлена та чекае за адресою: ${order.recipientAddress}.`,
            });
            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Connectable',
                text: `Ваша посилка доставлена та чекае за адресою: ${order.recipientAddress}.`,
            });

            await this.orderService.confirmOrder(query.id, {
                status: "Доставлено",
                deliveredDate: Date.now
            })

            return {
                status: "Доставлено"
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }

    @Get('/search')
    public async searchOrder(@Body() body, @Headers() headers){
        try {
            const token = headers.token

            const isManager = await this.authService.checkManeger(token)

            if(!isManager){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const orders = getRepository(Order).find({where:
                [ 
                    {number: Like(`%${body.number}%`) }
                ]
            })
            return {orders}
            
        } catch (e) {
            return {
                error: e
            }
        }
    }

    @Get('/manager')
    public async getAllOrders(@Headers() headers, @Query() query){
        try {
            const token = headers.token

            const isManager = await this.authService.checkManeger(token)

            if(!isManager){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const orders = await getRepository(Order).find()

            return {
                orders
            }
            
        } catch (e) {
            return{
                error: e
            }
        }
    }

    @Get()
    public async getOrdersByUserId(@Headers() headers){
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

            const orders = await this.orderService.getByUserId(decode.userId)

            const secondOrders = await getRepository(Order).find({sendToEmail: user.email})
            let allOrders = orders.concat(secondOrders).sort(
                (a, b) => {
                    if(a.id > b.id){
                        return 1
                    }
                    else if (a.id < b.id){
                        return -1
                    }
                    return 0
                }
            )
            return {
                orders: allOrders
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }
}
