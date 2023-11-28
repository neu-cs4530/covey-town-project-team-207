import { render, screen, act } from '@testing-library/react';
import React from 'react';
import NewVoteKickNotificationModal from './VoteKickNotificationModal';

function renderVoteKickNotificationModal() {
  return render(<NewVoteKickNotificationModal/>);
}

describe('Button to vote in favor of kicking the player', () => {
  it('should appear on first render', () => {
    renderVoteKickNotificationModal();
    expect(screen.queryByText('Kick')).toBeInTheDocument();
  });
  it('should add a vote in favor of kicking the player if the button to do so is clicked', () => {
    renderVoteKickNotificationModal();
  });
});
describe('Button to vote in disfavor of kicking the player', () => {
  it('should appear on first render', () => {
    renderVoteKickNotificationModal();
    expect(screen.queryByText('Don\'t Kick')).toBeInTheDocument();
  });
});