import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { SESSION_KEYS } from '../constants'
import { UserService } from '../user.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  formGroup = new FormGroup({
    username: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
    password: new FormControl<string>('', { validators: [Validators.required], nonNullable: true })
  })

  displayLoginError = false

  constructor (private readonly userService: UserService,
    private readonly router: Router) { }

  attemptLogin (): void {
    if (this.formGroup.valid) {
      this.userService.login(this.formGroup.controls.username.value,
        this.formGroup.controls.password.value)
        .subscribe(success => {
          if (success !== undefined) {
            sessionStorage.setItem(SESSION_KEYS.LOGGED_IN, success.toString())
            void this.router.navigate(['/'])
          } else {
            this.displayLoginError = true
          }
        })
    }
  }
}
