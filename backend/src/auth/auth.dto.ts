/* istanbul ignore file */
import { IsAlphanumeric, IsInt, IsString, Length } from 'class-validator';

export class AuthDTO {
  @Length(42, 42)
  @IsAlphanumeric()
  wallet!: string;

  @IsString()
  @Length(1)
  secret!: string; //OTP = one time password

  @IsInt()
  timestamp!: number;
}