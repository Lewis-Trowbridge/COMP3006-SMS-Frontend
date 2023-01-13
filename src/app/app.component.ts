import { Component } from '@angular/core'
import { SESSION_KEYS } from './constants'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'COMP3006-SMS-Frontend'
  get loggedIn (): string | null {
    return sessionStorage.getItem(SESSION_KEYS.LOGGED_IN)
  }
}
