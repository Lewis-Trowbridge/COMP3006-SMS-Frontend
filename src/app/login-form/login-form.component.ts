import { Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { UserService } from '../user.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  formGroup = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true })
  })

  constructor (private readonly userService: UserService) { }

  attemptLogin (): void {
    if (this.formGroup.valid) {
      this.userService.login(this.formGroup.controls.username.value,
        this.formGroup.controls.password.value)
        .subscribe(value => console.log(value))
    }
  }
}
