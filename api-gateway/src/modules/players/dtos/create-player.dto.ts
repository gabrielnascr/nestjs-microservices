import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreatePlayerDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly phoneNumber: string;

  category: string;
}
