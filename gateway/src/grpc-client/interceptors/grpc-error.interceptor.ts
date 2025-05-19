import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { status } from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error?.code) {
          const statusMap = {
            [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
            [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
            [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
            [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
            [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
          };

          const httpStatus =
            statusMap[error.code] || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || 'Internal server error';

          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: httpStatus,
                  message,
                  error: `GRPC_${error.code}`,
                },
                httpStatus,
              ),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
