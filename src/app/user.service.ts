import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (private readonly httpClient: HttpClient) { }

  login (username: string, password: string): Observable<boolean> {
    return this.httpClient.post<null>(`${environment.BACKEND_URL}/users/login`, { username, password })
      .pipe(
        catchError(() => {
          return of(false)
        }),
        map((value) => {
          return value === null
        })
      )
  }
}
