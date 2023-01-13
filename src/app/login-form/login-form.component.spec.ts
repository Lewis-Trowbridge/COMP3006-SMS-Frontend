import { ReactiveFormsModule } from '@angular/forms'
import { render, waitFor } from '@testing-library/angular'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { of } from 'rxjs'
import { AppModule } from '../app.module'
import { UserService } from '../user.service'
import userEvent from '@testing-library/user-event'

import { LoginFormComponent } from './login-form.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

describe('LoginFormComponent', () => {
  it('sends username and password to service', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(LoginFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()
    const mockLogin = jest.fn().mockReturnValue(of<boolean>(true))
    MockInstance(UserService, 'login', mockLogin)

    const expectedUsername = 'username'
    const expectedPassword = 'password'

    const { findByLabelText, findByRole } = await render(LoginFormComponent, moduleMetadata)

    const usernameInput = await findByLabelText('Username')
    const passwordInput = await findByLabelText('Password')

    await user.type(usernameInput, expectedUsername)
    await user.type(passwordInput, expectedPassword)

    const loginButton = await findByRole('button', { name: 'Login' })
    await user.click(loginButton)

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))
    expect(mockLogin).toHaveBeenNthCalledWith(1, expectedUsername, expectedPassword)
  })

  it('displays an error when service returns false', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(LoginFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()
    const mockLogin = jest.fn().mockReturnValue(of<boolean>(false))
    MockInstance(UserService, 'login', mockLogin)

    const expectedUsername = 'username'
    const expectedPassword = 'password'

    const { findByLabelText, findByRole, findByText } = await render(LoginFormComponent, moduleMetadata)

    const usernameInput = await findByLabelText('Username')
    const passwordInput = await findByLabelText('Password')

    await user.type(usernameInput, expectedUsername)
    await user.type(passwordInput, expectedPassword)

    const loginButton = await findByRole('button', { name: 'Login' })
    await user.click(loginButton)

    expect(await findByText('Login failed. Please try again.')).toBeInTheDocument()
  })

  it('does not make request to service if forms are not filled', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(LoginFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()
    const mockLogin = jest.fn()
    MockInstance(UserService, 'login', mockLogin)

    const { findByRole } = await render(LoginFormComponent, moduleMetadata)

    const loginButton = await findByRole('button', { name: 'Login' })
    await user.click(loginButton)

    await waitFor(() => expect(mockLogin).not.toHaveBeenCalled())
  })

  it.each(['Username', 'Password'])('%s input should show validation error if value left blank', async (label) => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(LoginFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()

    const { findByLabelText, findByText } = await render(LoginFormComponent, moduleMetadata)
    const input = await findByLabelText(label)
    await user.click(input)
    await user.keyboard('[Backspace]')
    await user.tab()
    const errorMessage = `${label} is required.`
    expect(await findByText(errorMessage)).toBeInTheDocument()
  })
})
