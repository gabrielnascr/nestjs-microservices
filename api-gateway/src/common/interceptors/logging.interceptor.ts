import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('Logging');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${request.method.toUpperCase()} - ${request.url} - ${Date.now() -
              now}ms`,
          ),
        ),
      );
  }
}
