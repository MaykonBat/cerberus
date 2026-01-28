import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getCerberus(): string {
    return 'Hello Cerberus!';
  }
}
