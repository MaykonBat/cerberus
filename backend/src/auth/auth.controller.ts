import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { JWT, Status, User } from 'commons';
import { MailerService } from '@nestjs-modules/mailer';
import Config from '../config';
import { AuthService } from './auth.service';
import { ethers } from 'ethers';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  async signin(@Body() data: AuthDTO): Promise<string> {
    const aMinuteAgo = Date.now() - 60 * 1000;
    if (data.timestamp < aMinuteAgo)
      throw new BadRequestException('Timestamp too old.');

    const message = Config.AUTH_MSG.replace('<timestamp>', `${data.timestamp}`);
    let wallet: string;

    try {
      wallet = ethers.verifyMessage(message, data.secret);
    } catch (err) {
      throw new BadRequestException('Invalid secret.');
    }

    if (wallet.toUpperCase() === data.wallet.toUpperCase()) {
      const user = await this.userService.getUserByWallet(wallet);
      if (!user) throw new NotFoundException('User not found. Signup first.');
      if (user.status === Status.BANNED)
        throw new UnauthorizedException('User Banned.');

      return this.authService.createToken({
        userId: user.id,
        address: user.address,
        name: user.name,
        planId: user.planId,
        status: user.status,
      } as JWT);
    }

    throw new UnauthorizedException("Wallet and secret doesn't match.");
  }

  @Post('signup')
  async signup(@Body() data: UserDTO): Promise<User> {
    const user = await this.userService.addUser(data);

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Activate your user on Cerberus`,
      text: `Hi, ${user.name}!
      
      Use the link below to finish your signup (copy and paste if the link doesn't work):
      
      ${Config.SITE_URL}/activate?wallet=${user.address}&code=${user.activationCode}
      
      Or if you are with the activation page opened, use the code below:
      
      ${user.activationCode}
      
      See you!
      
      admin`,
    });

    return user;
  }

  @Post('activate/:wallet/:code')
  async activate(
    @Param('wallet') wallet: string,
    @Param('code') code: string,
  ): Promise<string> {
    const user = await this.userService.activateUser(wallet, code);

    await this.mailerService.sendMail({
      to: user.email,
      subject: `User activated, next steps in this email`,
      text: `Hi, ${user.name}!
      
      Your user is activated. But before start bot trading, you need to pay the first month in advance.
      
      Use the link below to make your payment (copy and paste if the link doesn't work):
      
      ${Config.SITE_URL}/pay/${user.address}
      
      Or if you are with the website opened, just click in login button again.
      
      See you!
      
      admin`,
    });

    return this.authService.createToken({
      userId: user.id,
      address: user.address,
      name: user.name,
      planId: user.planId,
      status: user.status,
    } as JWT);
  }
}
