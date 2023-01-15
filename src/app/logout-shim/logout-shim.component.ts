import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { SESSION_KEYS } from '../constants'
import { UserService } from '../user.service'

@Component({
  selector: 'app-logout-shim',
  templateUrl: './logout-shim.component.html',
  styleUrls: ['./logout-shim.component.css']
})
export class LogoutShimComponent implements OnInit {
  constructor (private readonly userService: UserService,
    private readonly router: Router) { }

  ngOnInit (): void {
    this.userService.logout().subscribe(() => {
      sessionStorage.removeItem(SESSION_KEYS.LOGGED_IN)
      void this.router.navigate(['/'])
    })
  }
}
