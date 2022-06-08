import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as clc from 'cli-color';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private cliColor = {};
  constructor() {
    this.cliColor['time'] = clc.xterm(29);
    this.cliColor['remote'] = clc.xterm(227);
    this.cliColor['class'] = clc.xterm(39);
    this.cliColor['method'] = clc.xterm(45);
    this.cliColor['verb'] = clc.xterm(51);
    this.cliColor['status'] = clc.xterm(87);
    this.cliColor['ptime'] = clc.xterm(47);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const statusCode = context.switchToHttp().getResponse()['statusCode'];
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    // console.log(response);
    const { rawHeaders, httpVersion, method, socket, url } = request;
    const { remoteAddress, remoteFamily } = socket;
    const reqTime: Date = new Date();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `${this.cliColor['time'](reqTime.toISOString())} ${this.cliColor[
              'remote'
            ](remoteAddress)}:::${this.cliColor['class'](
              className,
            )}/${this.cliColor['method'](methodName)}/${this.cliColor['verb'](
              method,
            )}:${this.cliColor['status'](statusCode)}` +
              `-> ${this.cliColor['ptime'](
                `${Date.now() - reqTime.getTime()}ms`,
              )}`,
          ),
        ),
      );
  }
}
