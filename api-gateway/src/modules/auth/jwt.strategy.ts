/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AwsCognitoConfig } from "src/aws/cognito/aws-cognito.config";
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger(JwtStrategy.name)

    constructor(
        private authConfig: AwsCognitoConfig
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            audience: authConfig.clientId,
            issuer: authConfig.authority,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${authConfig.authority}/.well-known/jwks.json`
            })
        })
    }

    public async validate(payload: any): Promise<any> {
        this.logger.log(`payload: ${JSON.stringify(payload)}`)
        return { id: payload.sub, email: payload.email }
    }
}