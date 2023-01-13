import { Component } from '@angular/core'
import { SESSION_KEYS } from './constants'
import { UserType } from './user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'COMP3006-SMS-Frontend'

  // Workaround for enum to work in frontend
  UserType = UserType

  get loggedIn (): UserType | null {
    const value = sessionStorage.getItem(SESSION_KEYS.LOGGED_IN)
    if (value !== null) {
      return parseInt(value)
    } else {
      return value
    }
  }
}
