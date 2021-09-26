import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
     ) {}
  
     public async create(user: any) {
        const newUser = await this.userRepository.save(user)
        return newUser
     }
  
     public async getOneByEmail(email: string) {
        return this.userRepository.findOne({ email })
     }
  
     public async getOneById(id: number) {
        return this.userRepository.findOne({ id })
     }

     public async getOneByPhone(phone: string) {
        return this.userRepository.findOne({ phone })
     }
  
     public async getAllUsers() {
        return this.userRepository.find()
     }
  
     public async deleteUserById(id: number) {
        return this.userRepository.delete(id)
     }

     public async updateProfile(id: number, body: any){
         return this.userRepository.update({id}, body)
     }
}
