import { Injectable } from '@nestjs/common';
import {
    AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthRegisterDto } from 'src/modules/auth/dtos/auth-register.dto';
import { AuthLoginDto } from 'src/modules/auth/dtos/auth-login.dto'
import { AwsCognitoConfig } from './aws-cognito.config';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;    

  constructor(private authConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async register(authRegisterDto: AuthRegisterDto): Promise<any> {
    const { name, email, phoneNumber, password } = authRegisterDto;

    return new Promise((resolve, rejects) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phoneNumber,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
              rejects(err)
          } else {
              resolve(result.user)
          }
        },
      );
    });
  }

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto

    const userData = {
        Username: email, 
        Pool: this.userPool
    }

    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
    })

    const userCognito = new CognitoUser(userData)

    return new Promise((resolve, rejects) => {
        userCognito.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                resolve(result)
            },
            onFailure: (err) => {
                rejects(err)
            }
        })
    })

  }
}
