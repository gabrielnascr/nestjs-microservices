import { Module } from '@nestjs/common';
import { AwsCognitoService } from './cognito/aws-cognito.service';
import { AwsService } from './aws.service';
import { AwsCognitoConfig } from './cognito/aws-cognito.config';

@Module({
  providers: [AwsService, AwsCognitoService, AwsCognitoConfig],
  exports: [AwsService, AwsCognitoService, AwsCognitoConfig],
})
export class AwsModule {}
