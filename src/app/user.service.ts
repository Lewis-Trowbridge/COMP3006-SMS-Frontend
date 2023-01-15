import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, of } from 'rxjs'
import { environment } from '../environments/environment'

export enum UserType {
  Customer,
  Staff
}

interface UserTypeResponse {
  type: UserType
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (private readonly httpClient: HttpClient) { }

  create (username: string, password: string): Observable<UserType | undefined> {
    return this.httpClient.post<UserTypeResponse>(`${environment.BACKEND_URL}/users/create`, { username, password })
      .pipe(
        catchError(() => {
          return of(undefined)
        }),
        map((value) => {
          return value?.type
        })
      )
  }

  login (username: string, password: string): Observable<UserType | undefined> {
    return this.httpClient.post<UserTypeResponse>(`${environment.BACKEND_URL}/users/login`, { username, password })
      .pipe(
        catchError(() => {
          return of(undefined)
        }),
        map((value) => {
          return value?.type
        })
      )
  }

  logout (): Observable<null> {
    return this.httpClient.get<null>(`${environment.BACKEND_URL}/users/logout`)
  }

  search (name: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.BACKEND_URL}/users/search`, { params: { name } })
  }
}
