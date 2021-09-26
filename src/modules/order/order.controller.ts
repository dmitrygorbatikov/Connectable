import { Body, Controller, Post, Headers, HttpStatus, Get, Put, Query } from '@nestjs/common';
import { getRepository, Like } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Order } from './order.entity';
import { OrderService } from './order.service';

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

            const number = this.authService.getRandomNumber(1000000000, 9999999999)
            
            const order = await this.orderService.createOrder({
                number,
                title: body.title,
                cost: body.cost,
                sendAddress: body.sendAddress,
                recipientAddress:body.recipientAddress,
                deliveryCost: body.deliveryCost,
                weight:body.weight,
                height:body.height,
                width: body.width,
                userId: body.userId,
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

            await this.orderService.confirmOrder(query.id, {
                status: "Подтверждён"
            })
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

            await this.orderService.confirmOrder(query.id, {
                status: "Отправлен"
            })
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

            await this.orderService.confirmOrder(query.id, {
                status: "Доставлен"
            })
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

            const orders = getRepository(Order).findAndCount({where: 
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

            const orders = await getRepository(Order).findAndCount({
                take: query.take,
                skip: query.skip
            })

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
    
            const userByEmail = await this.userService.getOneById(decode.userId)
    
            if(!userByEmail){
                return {
                    error: "Пользователь не найден"
                }
            }

            const orders = await this.orderService.getByUserId(decode.userId)

            return {
                orders
            }
        }
        catch(e){
            return {
                error: e
            }
        }
    }


}
