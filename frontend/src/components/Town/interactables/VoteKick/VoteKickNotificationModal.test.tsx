import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import VotekickNotificationModal from './VoteKickNotificationModal';
import { mock } from 'jest-mock-extended';
import VotekickController from '../../../../classes/interactable/VotekickController';
import TownController from '../../../../classes/TownController';
import { ChakraProvider } from '@chakra-ui/react';
import TownControllerContext from '../../../../contexts/TownControllerContext';

class MockVotekickController extends VotekickController {
    public constructor() {
        super(mock<TownController>())
    }

    public recordVote(vote: boolean): void {
    }
}
describe('Rendering the votekick UI', () => {
    // Spy on console.error and intercept react key warnings to fail test
    let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParms: any[]]>;
    let mockVotekickController = new MockVotekickController();
    const townController = mock<TownController>();
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
    function renderVotekickNotificationModal(name: string) {
        return (
        <ChakraProvider>
            <TownControllerContext.Provider value={townController}>
                <VotekickNotificationModal username={name} votekickController={mockVotekickController}></VotekickNotificationModal>
            </TownControllerContext.Provider>
        </ChakraProvider>)
    }
    it('Renders a button to vote to kick', () => {
        renderVotekickNotificationModal('quinn');
        expect(screen.queryByText('Kick')).toBeInTheDocument();
    })
    it('Renders a button to vote to not kick', () => {
        renderVotekickNotificationModal('quinn');
        expect(screen.queryByText('Do Not Kick')).toBeInTheDocument();
    })
});
describe('Interacting with the votekick UI', () => {
    // Spy on console.error and intercept react key warnings to fail test
    let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParms: any[]]>;
    let mockVotekickController = new MockVotekickController();
    const townController = mock<TownController>();
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
    function renderVotekickNotificationModal(name: string) {
        return (
        <ChakraProvider>
            <TownControllerContext.Provider value={townController}>
                <VotekickNotificationModal username={name} votekickController={mockVotekickController}></VotekickNotificationModal>
            </TownControllerContext.Provider>
        </ChakraProvider>)
    }
    it('records the vote in favor of kicking when the player clicks the kick button', () => {
        renderVotekickNotificationModal('quinn');
        expect(screen.queryByText('Kick')).toBeInTheDocument();
        const button = screen.getByText('Kick');
        fireEvent.click(button);
        expect(mockVotekickController.recordVote).toBeCalledWith(true);
    });
    it('records the vote in disfavor of kicking when the player clicks the do not kick button', () => {
        renderVotekickNotificationModal('quinn');
        expect(screen.queryByText('Kick')).toBeInTheDocument();
        const button = screen.getByText('Kick');
        fireEvent.click(button);
        expect(mockVotekickController.recordVote).toBeCalledWith(false);
    });
});