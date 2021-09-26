import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Department } from './department.entity';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
     ) {}

     public getOneByCity(city: string){
        return this.departmentRepository.findOne({city})
    }

    public getOneById(id: number){
        return this.departmentRepository.findOne({id})
    }

     public create(body: any){
         return this.departmentRepository.save(body)
     }

     public delete(id: number){
         return this.departmentRepository.delete(id)
     }

     public update(id: number, body: any){
         return this.departmentRepository.update({id}, body)
     }
}
