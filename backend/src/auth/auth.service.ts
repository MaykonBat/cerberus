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
    return this.jwtService.decode(authorization.replace('Bearer ', '')) as JWT;
  }

  async checkToken(token: string) {
    try {
      return this.jwtService.verify(token.replace('Bearer ', ''), {
        secret: Config.JWT_SECRET,
      });
    } catch (err) {
      //console.error(err);
      throw new UnauthorizedException('Invalid JWT.');
    }
  }
}