import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { TownEmitter } from '../types/CoveyTownSocket';
import VoteKick from './VoteKick';

describe('Tests for VoteKick Model', () => {
  const townEmitter = mock<TownEmitter>();
  let playerToKick: Player;
  let model: VoteKick;
  let player: Player;

  beforeEach(async () => {
    playerToKick = new Player(nanoid(), townEmitter);
    model = new VoteKick(playerToKick);
    player = new Player(nanoid(), townEmitter);
  });
  it('Should create a VoteKick object with the correct username and an empty vote dictionary', () => {
    expect(model).toBeDefined();
    expect(model.votes).toEqual({});
    expect(model.playerToKick).toEqual(playerToKick);
  });
  it('Should add a positive vote to the vote dictionary when addVote is called with "true"', () => {
    model.addVote(player.userName, true);
    expect(model.votes).toEqual({ [player.userName]: true });
  });
  it('Should add a negative vote to the vote dictionary when addVote is called with "false"', () => {
    model.addVote(player.userName, false);
    expect(model.votes).toEqual({ [player.userName]: false });
  });
  it('Should return true when hasVoted is called with a player who has voted', () => {
    model.addVote(player.userName, true);
    expect(model.hasVoted(player.userName)).toEqual(true);
  });
  it('Should return false when hasVoted is called with a player who has not voted', () => {
    expect(model.hasVoted(player.userName)).toEqual(false);
  });
  it('Should throw an error when addVote is called with a player who has already voted', () => {
    model.addVote(player.userName, true);
    expect(model.hasVoted(player.userName)).toEqual(true);
    expect(() => model.addVote(player.userName, true)).toThrowError();
  });
  it('Should handle multiple votes correctly', () => {
    const player2 = new Player(nanoid(), townEmitter);
    model.addVote(player.userName, true);
    model.addVote(player2.userName, false);
    expect(model.votes).toEqual({ [player.userName]: true, [player2.userName]: false });
  });
  it('Should return true when voteKickSuccessful is called with a majority of positive votes', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player.userName, true);
    model.addVote(player2.userName, true);
    model.addVote(player3.userName, false);
    expect(model.voteKickSuccessful()).toEqual(true);
  });
  it('Should return false when voteKickSuccessful is called with a minority of positive votes', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player.userName, true);
    model.addVote(player2.userName, false);
    model.addVote(player3.userName, false);
    expect(model.voteKickSuccessful()).toEqual(false);
  });
});
