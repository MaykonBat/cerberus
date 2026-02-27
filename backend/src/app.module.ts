/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import Config from './config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PoolController } from './pool/pool.controller';
import { PoolService } from './pool/pool.service';
import { AutomationController } from './automation/automation.controller';
import { AutomationService } from './automation/automation.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: Config.MAILER_TRANSPORT,
      defaults: {
        secure: false,
        from: Config.DEFAULT_FROM
      }
    }),
    AuthModule
  ],
  controllers: [AppController, UserController, PoolController, AutomationController],
  providers: [AppService, UserService, AuthService, JwtService, PoolService, AutomationService],
})
export class AppModule {}
