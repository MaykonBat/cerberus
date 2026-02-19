import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Status, User } from 'commons';
import db from '../db';
import { UserDTO } from './user.dto';
import Config from '../config';
import { encrypt, decrypt } from 'commons/services/cryptoService';

@Injectable()
export class UserService {
  async getUserByWallet(address: string): Promise<User> {
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
    const user = await db.users.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException();
    user.privateKey = decrypt(user.privateKey);

    return user;
  }

  static generateActivationCode(length: number): string {
    const validChars = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++)
      code += validChars[Math.floor(Math.random() * 10)];
    return code;
  }

  async addUser(user: UserDTO): Promise<User> {
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
            activationCode: UserService.generateActivationCode(6),
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
        planId: user.planId || "Gold",
        activationCode: UserService.generateActivationCode(6),
        activationDate: new Date(),
        privateKey: '',
        status: Status.NEW,
        network: Config.CHAIN_ID,
      },
    });
  }

  async payUser(address: string): Promise<User> {
    const user = await this.getUserByWallet(address);
    if (user.status !== Status.BLOCKED) throw new ForbiddenException();

    //TODO: pay via blockchain

    const updatedUser = await db.users.update({
      where: { id: user.id },
      data: { status: Status.ACTIVE },
    });

    updatedUser.privateKey = '';
    return updatedUser;
  }

  async updateUser(id: string, user: UserDTO): Promise<User> {
    const data: any = {
      address: user.address,
      email: user.email,
      name: user.name,
    };

    if (user.privateKey) {
      data.privateKey = encrypt(user.privateKey);
    }

    const updatedUser = await db.users.update({
      where: { id },
      data,
    });

    if (updatedUser) 
      updatedUser.privateKey = '';

    return updatedUser;
  }

  async activateUser(wallet: string, code: string): Promise<User> {
    const user = await this.getUserByWallet(wallet);
    if (user.status !== Status.NEW) return user;

    if (user.activationCode !== code)
      throw new UnauthorizedException(`Wrong activation code.`);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (user.activationDate < tenMinutesAgo)
      throw new UnauthorizedException(`Activation code expired.`);

    const updatedUser = await db.users.update({
      where: { id: user.id },
      data: {
        status: Status.BLOCKED,
      },
    });

    updatedUser.privateKey = '';
    return updatedUser;
  }
}
