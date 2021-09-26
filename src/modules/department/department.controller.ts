import { Body, Controller, Post , Headers, HttpStatus, Get, Delete, Param, Put} from '@nestjs/common';
import { getRepository, Like } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
    constructor(private departmentService: DepartmentService, private authService: AuthService){}

    @Post()
    public async addDepartment(@Body() body, @Headers() headers){
        try {
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const department = await this.departmentService.create({
                number: body.number,
                city: body.city,
                street: body.street,
                latitude: body.latitude,
                longtitude: body.longtitude
            })
            return {
                department
            }

        } catch (e) {
            return {
                error: e
            }
        }
    }

    @Get('/search')
    public async searchDepartments(@Body() body, @Headers() headers){
        const token = headers.token

            const isAuth = await this.authService.checkUser(token)

            if(!isAuth){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

        const departments = getRepository(Department).findAndCount({
            where: [
                {city: Like(`%${body.city}%`) }

            ]
        })

        return {departments}
    }

    @Delete('/:id')
    public async deleteDepartment(@Param() params, @Headers() headers){
        try {
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const department = await this.departmentService.getOneById(params.id)

            if(!department){
                return {
                    error: "Отделение не найдено"
                }
            }

            await this.departmentService.delete(params.id)
            
            return {
                message: "Видалено"
            }

        } catch (e) {
            return {
                error: e
            }
        }
    }

    @Put('/:id')
    public async updateDepartment(@Body() body, @Headers() headers, @Param() params){
        try {
            const token = headers.token

            const isAdmin = await this.authService.checkAdmin(token)

            if(!isAdmin){
                return {
                    error: "Нет авторизации",
                    status: HttpStatus.UNAUTHORIZED
                }
            }

            const department = await this.departmentService.getOneById(params.id)

            if(!department){
                return {
                    error: "Отделение не найдено"
                }
            }

            await this.departmentService.update(params.id, body)

            return {
                message: 'Обновлено'
            }

            
        } catch (e) {
            return {
                error: e
            }
        }
    }


}
