import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { catchError, Observable, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { environment } from '../environments/environment'

@Injectable()
export class UnauthorisedRedirectInterceptor implements HttpInterceptor {
  constructor (private readonly router: Router) { }

  intercept (request: HttpRequest<never>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            if (!(err.url === `${environment.BACKEND_URL}/login`)) {
              void this.router.navigate(['/login'])
            }
          }
          return throwError(() => err)
        } else {
          return throwError(() => err)
        }
      })
    )
  }
}
