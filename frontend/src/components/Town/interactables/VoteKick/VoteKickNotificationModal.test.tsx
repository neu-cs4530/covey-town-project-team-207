import { render, screen, act } from '@testing-library/react';
import React from 'react';
import NewVoteKickNotificationModal from './VoteKickNotificationModal';

function renderVoteKickNotificationModal() {
  return render(<NewVoteKickNotificationModal/>);
}