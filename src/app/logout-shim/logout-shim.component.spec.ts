import { render, waitFor } from '@testing-library/angular'
import { MockBuilder, MockInstance } from 'ng-mocks'
import { of } from 'rxjs'
import { AppModule } from '../app.module'
import { UserService } from '../user.service'
import { LogoutShimComponent } from './logout-shim.component'

describe('LogoutShimComponent', () => {
  it('should call logout on render', async () => {
    const mockLogout = jest.fn().mockReturnValue(of())
    const moduleMetadata = MockBuilder(LogoutShimComponent, AppModule).build()
    MockInstance(UserService, 'logout', mockLogout)

    await render(LogoutShimComponent, moduleMetadata)

    await waitFor(() => expect(mockLogout).toHaveBeenCalled())
  })
})
