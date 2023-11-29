import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import VotekickNotificationModal from './VoteKickNotificationModal';
import PlayerController from '../../../../classes/PlayerController';
import TownController from '../../../../classes/TownController';
import TownControllerContext from '../../../../contexts/TownControllerContext';
import { mock } from 'jest-mock-extended';

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const ui = jest.requireActual('@chakra-ui/react');
  const mockUseToast = () => mockToast;
  return {
    ...ui,
    useToast: mockUseToast,
  };
});
describe('VoteKickNotificationModal', () => {
  let ourPlayer: PlayerController;
  const townController = mock<TownController>();
  Object.defineProperty(townController, 'ourPlayer', { get: () => ourPlayer });

  function renderModal() {
    return render(
      <ChakraProvider>
        <TownControllerContext.Provider value={townController}>
          <VotekickNotificationModal />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );
  }

  // Spy on console.error and intercept react key warnings to fail test
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParms: any[]]>;
  beforeAll(() => {
    // Spy on console.error and intercept react key warnings to fail test
    consoleErrorSpy = jest.spyOn(global.console, 'error');
    consoleErrorSpy.mockImplementation((message?, ...optionalParams) => {
      const stringMessage = message as string;
      if (stringMessage.includes && stringMessage.includes('children with the same key,')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      } else if (stringMessage.includes && stringMessage.includes('warning-keys')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      }
      // eslint-disable-next-line no-console -- we are wrapping the console with a spy to find react warnings
      console.warn(message, ...optionalParams);
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('Votekick modal should register 2 listeners, one for the start and one for the end of votekick ', () => {
    const addListenerSpy = jest.spyOn(townController, 'addListener');
    addListenerSpy.mockClear();

    renderModal();
    expect(addListenerSpy).toBeCalledTimes(2);
    expect(addListenerSpy).toHaveBeenCalledWith('initializeVotekick', expect.any(Function));
    expect(addListenerSpy).toHaveBeenCalledWith('endVotekick', expect.any(Function));
  });

  it('removes the listeners when the component is unmounted', () => {
    const removeListenerSpy = jest.spyOn(townController, 'removeListener');
    const addListenerSpy = jest.spyOn(townController, 'addListener');
    addListenerSpy.mockClear();
    removeListenerSpy.mockClear();
    const renderData = renderModal();
    expect(addListenerSpy).toBeCalledTimes(2);
    const addedListeners = addListenerSpy.mock.calls;
    const addedGameUpdateListener = addedListeners.find(call => call[0] === 'initializeVotekick');
    const addedGameEndedListener = addedListeners.find(call => call[0] === 'endVotekick');
    expect(addedGameEndedListener).toBeDefined();
    expect(addedGameUpdateListener).toBeDefined();
    renderData.unmount();
    expect(removeListenerSpy).toBeCalledTimes(2);
    const removedListeners = removeListenerSpy.mock.calls;
    const removedGameUpdateListener = removedListeners.find(
      call => call[0] === 'initializeVotekick',
    );
    const removedGameEndedListener = removedListeners.find(call => call[0] === 'endVotekick');
    expect(removedGameUpdateListener).toEqual(addedGameUpdateListener);
    expect(removedGameEndedListener).toEqual(addedGameEndedListener);
  });

  it('Does not register listeners on every render', () => {
    const removeListenerSpy = jest.spyOn(townController, 'removeListener');
    const addListenerSpy = jest.spyOn(townController, 'addListener');
    addListenerSpy.mockClear();
    removeListenerSpy.mockClear();
    const renderData = renderModal();
    expect(addListenerSpy).toBeCalledTimes(2);
    addListenerSpy.mockClear();

    renderData.rerender(
      <ChakraProvider>
        <TownControllerContext.Provider value={townController}>
          <VotekickNotificationModal />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );

    expect(addListenerSpy).not.toBeCalled();
    expect(removeListenerSpy).not.toBeCalled();
  });
});
