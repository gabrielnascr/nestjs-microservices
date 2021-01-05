import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/cognito/aws-cognito.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private awsCognitoService: AwsCognitoService
  ) { }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async register(@Body() authRegisterDto: AuthRegisterDto): Promise<any> {
    return await this.awsCognitoService.register(authRegisterDto)
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginDto: AuthLoginDto): Promise<any> {
    return await this.awsCognitoService.login(authLoginDto)
  }
}
