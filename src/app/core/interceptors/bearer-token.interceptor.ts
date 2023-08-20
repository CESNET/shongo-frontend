import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'shongo-token';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = window.localStorage.getItem(TOKEN_KEY);

    if (token) {
      return next.handle(
        request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      );
    }
    return next.handle(request);
  }
}
