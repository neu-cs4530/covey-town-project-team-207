import { render, screen, act } from '@testing-library/react';
import React from 'react';
import NewVoteKickNotificationModal from './VoteKickNotificationModal';
  
describe('NewVoteKickNotificationModal', () => {
    jest.setTimeout(15000);
    it('should render with the correct initial values', () => {
        render(<NewVoteKickNotificationModal username='Andrew'/>);
        expect(screen.getByText(/Disruptive user identified, votekick for/)).toBeInTheDocument();
        expect(screen.getByText(/Andrew/)).toBeInTheDocument();
        expect(screen.getByText(/occuring in:/)).toBeInTheDocument();
        expect(screen.getByText(/10 seconds/)).toBeInTheDocument();
    });
    it('should count down the timer correctly', async () => {
        render(<NewVoteKickNotificationModal username='Andrew'/>);
        expect(screen.getByText(/10 seconds/)).toBeInTheDocument();
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1100));
        });
        expect(screen.getByText(/9 seconds/)).toBeInTheDocument();
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 6100));
        });
        expect(screen.getByText(/3 seconds/)).toBeInTheDocument();
    });
    it('should close when timer hits 0', async () => {
        render(<NewVoteKickNotificationModal username='Andrew'/>);
        expect(screen.getByText(/10 seconds/)).toBeInTheDocument();
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 10500));
        });
        expect(screen.queryByText(/Disruptive user identified, votekick for/)).toBeNull();
        expect(screen.queryByText(/Andrew/)).toBeNull();
        expect(screen.queryByText(/occuring in:/)).toBeNull();
        expect(screen.queryByText(/0 seconds/)).toBeNull();
    });
});