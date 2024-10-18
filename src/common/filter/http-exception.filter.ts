import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseDto } from '../dto/response.dto';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private isValidationError(response: any): boolean {
    return response?.message;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    console.log('HttpExceptionFilter() ==> ');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let responseBody: ResponseDto<null>;

    if (exception instanceof BadRequestException) {
      //BadRequestException : 주로 유효성 검사 에러 처리
      console.log(':::: BadRequestException :::: ');
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (this.isValidationError(exceptionResponse)) {
        console.log('isValidationError -->');
        console.log('@exceptionResponse', exceptionResponse);
        const errors = this.mapValidationErrors(exceptionResponse['message']);
        responseBody = new ResponseDto(false, null, status, undefined, errors);
      } else if (exceptionResponse['errors']) {
        responseBody = new ResponseDto(
          false,
          null,
          status,
          undefined,
          exceptionResponse['errors'],
        );
      } else {
        const message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse['message'];
        responseBody = new ResponseDto(false, null, status, message);
      }
    } else if (exception instanceof HttpException) {
      // 그 외의 일반적인 HttpException 처리
      console.log(':::: HttpException :::: ');
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const { message } = exceptionResponse as Record<string, any>;
      responseBody = new ResponseDto(false, null, status, message);
    } else {
      // 기타 예상하지 못한 오류 처리
      console.log('예상하지못한 오류!');

      responseBody = new ResponseDto(
        false,
        null,
        status,
        'Internal Server Error',
      );
    }

    response.status(status).json(responseBody);
  }

  private mapValidationErrors(
    messages: Record<string, any>[],
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    console.log('mapValidationErrors ==>');
    console.log('messages', messages);

    for (const message of messages) {
      // 예를 들어 "email: 이메일 주소가 잘못되었습니다." 형식의 메시지로 가정하고 분할
      //const constraintMessages = Object.values(message.constraints) as string[];
      console.log('@message', message);

      const constraintMessages = Object.values(message.constraints) as string[];
      errors[message.property] = constraintMessages[0];
    }
    console.log('@@errors', errors);
    return errors;
  }
}
