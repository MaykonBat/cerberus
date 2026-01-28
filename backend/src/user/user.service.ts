import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status, User } from 'commons';
import connect from '../db';
import { UserDTO } from './user.dto';
import Config from '../config';

@Injectable()
export class UserService {
  async getUserByWallet(address: string): Promise<User> {
    const db = await connect();
    const user = await db.users.findFirst({
      where: {
        address: {
          equals: address,
          mode: 'insensitive', //ignora maiusculas e minusculas
        },
      },
    });

    if (!user) throw new NotFoundException();
    user.privateKey = '';

    return user;
  }

  async getUser(id: string): Promise<User> {
    const db = await connect();
    const user = await db.users.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException();
    // user.privateKey = ""; //TODO: descriptografar

    return user;
  }

  async addUser(user: UserDTO): Promise<User> {
    const db = await connect();

    const oldUser = await db.users.findFirst({
      where: {
        OR: [
          {
            address: user.address,
          },
          {
            email: user.email,
          },
        ],
      },
    });

    if (oldUser) {
      if (oldUser.status !== Status.NEW)
        throw new ConflictException(
          `User already exists with the same wallet or email.`,
        );
      else {
        return db.users.update({
          where: { id: oldUser.id },
          data: {
            activationCode: '0', //TODO: gerar novo código
            activationDate: new Date(),
          },
        });
      }
    }

    return db.users.create({
      data: {
        address: user.address,
        email: user.email,
        name: user.name,
        planId: user.planId,
        activationCode: '', //TODO: gerar código
        activationDate: new Date(),
        privateKey: '',
        status: Status.NEW,
        network: Config.CHAIN_ID,
      },
    });
  }

  async payUser(address: string) : Promise<User>{
    const user = await this.getUserByWallet(address);
    if(!user) throw new NotFoundException();
    if(user.status !== Status.BLOCKED) throw new ForbiddenException();

    const db = await connect();

    //TODO: pay via blockchain

    const updatedUser = await db.users.update({
        where: { id: user.id },
        data: { status: Status.ACTIVE}
    })

    updatedUser.privateKey = "";
    return updatedUser;
  }
}
