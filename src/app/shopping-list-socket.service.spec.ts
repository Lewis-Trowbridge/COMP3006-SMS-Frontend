import { ShoppingListSocketService, IShoppingListItem, IChangeObservers } from './shopping-list-socket.service'
import { mock } from 'jest-mock-extended'
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service'
import { of, Subject } from 'rxjs'

describe('ShoppingListSocketService', () => {
  describe('registerChangeObservers', () => {
    it('connects to the server', () => {
      const mockSocket = mock<WrappedSocket>()
      const service = new ShoppingListSocketService(mockSocket)

      service.registerChangeObservers('', of<IShoppingListItem[]>([]))

      expect(mockSocket.connect).toHaveBeenCalled()
    })

    it('emits socketIO joinListRoom with list room', () => {
      const mockSocket = mock<WrappedSocket>()
      const service = new ShoppingListSocketService(mockSocket)
      const expectedListId = 'list'

      service.registerChangeObservers(expectedListId, of<IShoppingListItem[]>([]))

      expect(mockSocket.emit).toHaveBeenCalledTimes(2)
      expect(mockSocket.emit).toHaveBeenNthCalledWith(1, 'joinListRoom', expectedListId)
    })

    it('emits socketIO resolveChanges when given observer emits with given list id and value', () => {
      const mockSocket = mock<WrappedSocket>()
      const service = new ShoppingListSocketService(mockSocket)
      const expectedListId = 'list'
      const expectedItem: IShoppingListItem = {
        _id: 'id',
        text: 'text',
        quantity: 0
      }

      service.registerChangeObservers(expectedListId, of<IShoppingListItem[]>([expectedItem]))

      expect(mockSocket.emit).toHaveBeenCalledTimes(2)
      expect(mockSocket.emit).toHaveBeenNthCalledWith(2, 'resolveChanges', expectedListId, [expectedItem])
    })

    it('returns distributeCanonical and acknowledge observable from fromEvent', () => {
      const mockSocket = mock<WrappedSocket>()
      const fakeCanonicalObservable = new Subject<IShoppingListItem[]>()
      const fakeAcknowledgeObservable = new Subject<null>()
      const expected: IChangeObservers = {
        acknowledge: fakeAcknowledgeObservable,
        distributeCanonical: fakeCanonicalObservable
      }
      mockSocket.fromEvent
        .mockReturnValueOnce(fakeAcknowledgeObservable)
        .mockReturnValueOnce(fakeCanonicalObservable)
      const service = new ShoppingListSocketService(mockSocket)
      const expectedListId = ''

      const actual = service.registerChangeObservers(expectedListId, of<IShoppingListItem[]>([]))

      expect(actual).toEqual(expected)
    })

    it('closes the connection', () => {
      const mockSocket = mock<WrappedSocket>()
      const service = new ShoppingListSocketService(mockSocket)

      service.close()

      expect(mockSocket.disconnect).toHaveBeenCalled()
    })
  })
})
