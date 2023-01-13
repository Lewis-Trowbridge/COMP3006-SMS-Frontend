import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { SESSION_KEYS } from '../constants'
import { UserService } from '../user.service'

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent {
  formGroup = new FormGroup({
    username: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
    password: new FormControl<string>('', { validators: [Validators.required], nonNullable: true })
  })

  displaySignupError = false

  constructor (private readonly userService: UserService,
    private readonly router: Router) { }

  attemptSignup (): void {
    if (this.formGroup.valid) {
      this.userService.create(this.formGroup.controls.username.value,
        this.formGroup.controls.password.value)
        .subscribe(success => {
          if (success !== undefined) {
            sessionStorage.setItem(SESSION_KEYS.LOGGED_IN, success.toString())
            void this.router.navigate(['/'])
          } else {
            this.displaySignupError = true
          }
        })
    }
  }
}
