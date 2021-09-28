import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
     ) {}

     public createOrder(body: any){
        return this.orderRepository.save(body)
     }

     public getByNumber(number: number){
        return this.orderRepository.findOne({number})
    }

    public getById(id: number){
        return this.orderRepository.findOne({id})
    }

    public confirmOrder(id: number, body){
        return this.orderRepository.update({id}, body)
    }

    public getByUserId(id: number){
        return this.orderRepository.find()
    }
}
