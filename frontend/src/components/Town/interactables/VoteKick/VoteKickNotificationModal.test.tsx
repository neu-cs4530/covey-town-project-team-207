import { render, screen, act } from '@testing-library/react';
import React from 'react';
import NewVoteKickNotificationModal from './VoteKickNotificationModal';

function renderVoteKickNotificationModal() {
  return render(<NewVoteKickNotificationModal username='Andrew' />);
}

/*
describe('Button to vote in favor of kicking the player', () => {
  it('should appear on first render', () => {
    renderVoteKickNotificationModal();
    expect(screen.queryByText('Kick Player')).toBeInTheDocument();
  });
  it('should add a vote in favor of kicking the player if the button to do so is clicked', () => {
    renderVoteKickNotificationModal();
  });
});
describe('Button to vote in disfavor of kicking the player', () => {
  it('should appear on first render', () => {
    renderVoteKickNotificationModal();
    expect(screen.queryByText('Do Not Kick Player')).toBeInTheDocument();
  });
});
*/

describe('NewVoteKickNotificationModal', () => {
  jest.setTimeout(15000);
  it('should render with the correct initial values', () => {
    renderVoteKickNotificationModal();
    expect(screen.getByText(/Disruptive user identified, votekick for/)).toBeInTheDocument();
    expect(screen.getByText(/Andrew/)).toBeInTheDocument();
    expect(screen.getByText(/occuring in:/)).toBeInTheDocument();
    expect(screen.getByText(/10 seconds/)).toBeInTheDocument();
  });
  it('should count down the timer correctly', async () => {
    renderVoteKickNotificationModal();
    expect(screen.getByText(/10 seconds/)).toBeInTheDocument();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
    });
    expect(screen.getByText(/9 seconds/)).toBeInTheDocument();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 6100));
    });
    expect(screen.getByText(/3 seconds/)).toBeInTheDocument();
  });
  it('should close when timer hits 0', async () => {
    renderVoteKickNotificationModal();
    expect(screen.getByText(/10 seconds/)).toBeInTheDocument();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10500));
    });
    expect(screen.queryByText(/Disruptive user identified, votekick for/)).toBeNull();
    expect(screen.queryByText(/Andrew/)).toBeNull();
    expect(screen.queryByText(/occuring in:/)).toBeNull();
    expect(screen.queryByText(/0 seconds/)).toBeNull();
  });
});
