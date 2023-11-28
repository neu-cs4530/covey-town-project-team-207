import { ChakraProvider } from '@chakra-ui/react';

import { render, screen, within } from '@testing-library/react';
import React from 'react';
import VoteKickNotificationModal from './VoteKickNotificationModal';
import { mockTownControllerConnection } from '../../../../TestUtils';
import { nanoid } from 'nanoid';
import TownController from '../../../../classes/TownController';
import { mock, mockClear } from 'jest-mock-extended';
import { LoginController } from '../../../../contexts/LoginControllerContext';
import { CoveyTownSocket } from '../../../../types/CoveyTownSocket';
import TownControllerContext from '../../../../contexts/TownControllerContext';
import PlayerController from '../../../../classes/PlayerController';

const mockSocket = mock<CoveyTownSocket>();
jest.mock('socket.io-client', () => {
  const actual = jest.requireActual('socket.io-client');
  return {
    ...actual,
    io: () => mockSocket,
  };
});

process.env.NEXT_PUBLIC_TOWNS_SERVICE_URL = 'testing';

describe('VoteKick Modal', () => {
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
  let testController: TownController;
  beforeEach(async () => {
    const allPlayers: PlayerController[] = [];
    for (let i = 0; i < 3; i += 1) {
      allPlayers.push(
        new PlayerController(`${i}}playerID:${nanoid()}`, `${i}userName:${nanoid()}`, {
          x: 0,
          y: 0,
          interactableID: nanoid(), // should not be checked by conversation area list
          rotation: 'front',
          moving: false,
        }),
      );
    }

    testController = new TownController({
      userName: nanoid(),
      townID: nanoid(),
      loginController: mock<LoginController>(),
      firebaseID: nanoid(),
    });

    await mockTownControllerConnection(testController, mockSocket, {
      interactables: [],
      currentPlayers: allPlayers.map(eachPlayer => eachPlayer.toPlayerModel()),
      friendlyName: nanoid(),
      isPubliclyListed: true,
      providerVideoToken: nanoid(),
      sessionToken: nanoid(),
      userID: nanoid(),
    });
    return render(
      <ChakraProvider>
        <React.StrictMode>
          <TownControllerContext.Provider value={testController}>
            <VoteKickNotificationModal />
          </TownControllerContext.Provider>
        </React.StrictMode>
      </ChakraProvider>,
    );
  });

  it('should render a the correct text', () => {
    screen.getAllByText('Please');
  });
});

// Tests to write
// displays the correct name
// counts votes correctly- right methods are called
// closes after vote
