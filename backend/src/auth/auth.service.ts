import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'commons';
import Config from '../config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(payload: JWT): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: Config.JWT_SECRET,
      expiresIn: Config.JWT_EXPIRES,
    });
  }

  decodeToken(authorization: string): JWT {
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid authorization header.');

    const token = authorization.slice(7);
    return this.jwtService.decode(token) as JWT;

  
  }

  async checkToken(authorization: string): Promise<boolean> {
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid authorization header.');

    const token = authorization.slice(7);

    try {
      this.jwtService.verify(token, {
        secret: Config.JWT_SECRET,
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid JWT.');
    }
  }
}
