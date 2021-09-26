import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { CreateConfirmEmail } from './auth.types';
import { ConfirmEmail } from './confirm-email.emtity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(ConfirmEmail)
        private confirmEmailRepository: Repository<ConfirmEmail>,
        private jwtService: JwtService,
        private userService: UserService
     ) {}
    
    public createConfirmEmail(body: CreateConfirmEmail) {
        return this.confirmEmailRepository.save(body)
    }
    
    public findConfirmEmail(email: string) {
        return this.confirmEmailRepository.findOne({ email })
    }
    
    public getRandomNumber(min: number, max: number): number {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

    public async deleteConfirmEmail(id: number) {
        return this.confirmEmailRepository.delete({ id });
      }

  public passwordHash(password): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public comparePassword(yourPassword, dbPassword){
      return bcrypt.compare(yourPassword, dbPassword)
  }

  public async checkUser(token: string){
    try{
    if(!token){
        return false
    }
    else{
        const decode = this.jwtService.verify(token)
        const user = await this.userService.getOneById(decode.userId)
        if(!user){
            return false
        }
    }
  }
  catch(e){
      return false
  }
}

public getIdByToken(token: string){
    try{
        return this.jwtService.verify(token)
    }
    catch(e){
        throw new Error(e)
    }
}

public async checkAdmin(token: string){
    try{
    if(!token){
        return false
    }
    else{
        const decode = this.jwtService.verify(token)
        const user = await this.userService.getOneById(decode.userId)
        if(!user || user.role !== 'admin'){
            return false
        }
        return decode
    }
  }
  catch(e){
      return false
  }
}

public async checkManeger(token: string){
    try {

        if(!token){
      console.log(false);

            return false
        }
        else{
            const decode = this.jwtService.verify(token)
            const user = await this.userService.getOneById(decode.userId)
            console.log(user.role);
            
            if(!user || user.role !== 'manager'){
                return false
            }
            return decode
        }
  }
  catch(e){
      console.log(e);
      
      return false
  }
}
}
