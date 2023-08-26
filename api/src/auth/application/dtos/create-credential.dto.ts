import { IsNotEmpty } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
