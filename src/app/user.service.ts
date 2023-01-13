import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../environments/environment'

export enum UserType {
  Customer,
  Staff
}

interface LoginResponse {
  type: UserType
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (private readonly httpClient: HttpClient) { }

  login (username: string, password: string): Observable<UserType | undefined> {
    return this.httpClient.post<LoginResponse>(`${environment.BACKEND_URL}/users/login`, { username, password })
      .pipe(
        catchError(() => {
          return of(undefined)
        }),
        map((value) => {
          return value?.type
        })
      )
  }
}
