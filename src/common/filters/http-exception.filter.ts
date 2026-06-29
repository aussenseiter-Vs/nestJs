import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      const resBody = res as Record<string, unknown>;
      if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray(resBody.message)) {
        message = (resBody.message as string[]).join(', ');
      } else if (typeof resBody.message === 'string') {
        message = resBody.message;
      } else if (resBody.message !== undefined) {
        message = JSON.stringify(resBody.message);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({ statusCode: status, message });
  }
}
