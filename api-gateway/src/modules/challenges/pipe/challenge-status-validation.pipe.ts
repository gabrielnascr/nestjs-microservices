import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../challenge-status.enum';

export class ChallegeStatusValidationPipe implements PipeTransform {
  readonly statusPermitidos = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any): any {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is a invalid status`);
    }
  }

  private isValidStatus(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    return idx !== -1;
  }
}
