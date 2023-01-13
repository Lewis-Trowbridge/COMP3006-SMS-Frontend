import { ReactiveFormsModule } from '@angular/forms'
import { render, waitFor } from '@testing-library/angular'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { of } from 'rxjs'
import { AppModule } from '../app.module'
import { UserService, UserType } from '../user.service'
import userEvent from '@testing-library/user-event'

import { CreateUserFormComponent } from './create-user-form.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

describe('CreateUserFormComponent', () => {
  it('sends username and password to service', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(CreateUserFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()
    const mockCreate = jest.fn().mockReturnValue(of<UserType | undefined>(UserType.Customer))
    MockInstance(UserService, 'create', mockCreate)

    const expectedUsername = 'username'
    const expectedPassword = 'password'

    const { findByLabelText, findByRole } = await render(CreateUserFormComponent, moduleMetadata)

    const usernameInput = await findByLabelText('Username')
    const passwordInput = await findByLabelText('Password')

    await user.type(usernameInput, expectedUsername)
    await user.type(passwordInput, expectedPassword)

    const signupButton = await findByRole('button', { name: 'Sign up' })
    await user.click(signupButton)

    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1))
    expect(mockCreate).toHaveBeenNthCalledWith(1, expectedUsername, expectedPassword)
  })

  it('displays an error when service returns undefined', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(CreateUserFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()
    const mockCreate = jest.fn().mockReturnValue(of<UserType | undefined>(undefined))
    MockInstance(UserService, 'create', mockCreate)

    const expectedUsername = 'username'
    const expectedPassword = 'password'

    const { findByLabelText, findByRole, findByText } = await render(CreateUserFormComponent, moduleMetadata)

    const usernameInput = await findByLabelText('Username')
    const passwordInput = await findByLabelText('Password')

    await user.type(usernameInput, expectedUsername)
    await user.type(passwordInput, expectedPassword)

    const signupButton = await findByRole('button', { name: 'Sign up' })
    await user.click(signupButton)

    expect(await findByText('Creation failed. Please try again.')).toBeInTheDocument()
  })

  it('does not make request to service if forms are not filled', async () => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(CreateUserFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()
    const mockCreate = jest.fn()
    MockInstance(UserService, 'create', mockCreate)

    const { findByRole } = await render(CreateUserFormComponent, moduleMetadata)

    const loginButton = await findByRole('button', { name: 'Sign up' })
    await user.click(loginButton)

    await waitFor(() => expect(mockCreate).not.toHaveBeenCalled())
  })

  it.each(['Username', 'Password'])('%s input should show validation error if value left blank', async (label) => {
    const user = userEvent.setup()
    const moduleMetadata = MockBuilder(CreateUserFormComponent, AppModule)
      .keep(ReactiveFormsModule)
      .keep(MatFormFieldModule)
      .keep(MatInputModule)
      .build()

    const { findByLabelText, findByText } = await render(CreateUserFormComponent, moduleMetadata)
    const input = await findByLabelText(label)
    await user.click(input)
    await user.keyboard('[Backspace]')
    await user.tab()
    const errorMessage = `${label} is required.`
    expect(await findByText(errorMessage)).toBeInTheDocument()
  })
})
