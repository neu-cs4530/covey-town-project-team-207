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
  it('Should create a VoteKick object with the correct id and an empty vote dictionary', () => {
    expect(model).toBeDefined();
    expect(model.votes).toEqual({});
    expect(model.playerToKick).toEqual(playerToKick);
  });
  it('Should add a positive vote to the vote dictionary when addVote is called with "true"', () => {
    model.addVote(player.id, true);
    expect(model.votes).toEqual({ [player.id]: true });
  });
  it('Should add a negative vote to the vote dictionary when addVote is called with "false"', () => {
    model.addVote(player.id, false);
    expect(model.votes).toEqual({ [player.id]: false });
  });
  it('Should return true when hasVoted is called with a player who has voted', () => {
    model.addVote(player.id, true);
    expect(model.hasVoted(player.id)).toEqual(true);
  });
  it('Should return false when hasVoted is called with a player who has not voted', () => {
    expect(model.hasVoted(player.id)).toEqual(false);
  });
  it('Should throw an error when addVote is called with a player who has already voted', () => {
    model.addVote(player.id, true);
    expect(model.hasVoted(player.id)).toEqual(true);
    expect(() => model.addVote(player.id, true)).toThrowError();
  });
  it('Should handle multiple votes correctly', () => {
    const player2 = new Player(nanoid(), townEmitter);
    model.addVote(player.id, true);
    model.addVote(player2.id, false);
    expect(model.votes).toEqual({ [player.id]: true, [player2.id]: false });
  });
  it('Should return true when voteKickSuccessful is called with a majority of positive votes', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player.id, true);
    model.addVote(player2.id, true);
    model.addVote(player3.id, false);
    expect(model.voteKickSuccessful()).toEqual(true);
  });
  it('Should return false when voteKickSuccessful is called with a minority of positive votes', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player.id, true);
    model.addVote(player2.id, false);
    model.addVote(player3.id, false);
    expect(model.voteKickSuccessful()).toEqual(false);
  });
  it('Should return true when isVotingDone is called with a majority of players voting in favor', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player2.id, true);
    model.addVote(player3.id, true);
    expect(model.isVotingDone([player, player2, player3])).toEqual(true);
  });
  it('Should return true when isVotingDone is called with a majority of players voting in disfavor', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player2.id, false);
    model.addVote(player3.id, false);
    expect(model.isVotingDone([player, player2, player3])).toEqual(true);
  });
  it('Should return false when isVotingDone is called with a majority not voting for the same outcome', () => {
    const player2 = new Player(nanoid(), townEmitter);
    const player3 = new Player(nanoid(), townEmitter);
    model.addVote(player.id, true);
    model.addVote(player3.id, false);
    expect(model.isVotingDone([player, player2, player3])).toEqual(false);
  });
});
