import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UserDTO } from '../user/user.dto';

@Controller('auth')
export class AuthController {

  @Post('signin')
  signin(@Body() data: AuthDTO): object {
    return data;
  }

  @Post("signup")
  signup(@Body() data: UserDTO): object {
    //TODO: verificar se já não existe
    

    //TODO: cadastrar no banco de dados

    //TODO: enviar email de confirmação
    return data;
  }

  @Post("activate/:wallet/:code")
  activate(@Param("wallet") wallet: string, @Param("code", ParseIntPipe) code: number): object {
    return {
      wallet,
      code
    };
  }
}