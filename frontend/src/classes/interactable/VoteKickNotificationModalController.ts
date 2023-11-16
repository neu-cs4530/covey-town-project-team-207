import TownController from '../TownController';
import VoteKick from '../../../../townService/src/town/VoteKick';

export default class VoteKickNotificationModalController {
  protected _townController: TownController;

  protected _model: VoteKick;

  constructor(townController: TownController, model: VoteKick) {
    this._townController = townController;
    this._model = model;
  }

  public recordVote(vote: boolean): void {
    throw Error('VoteKickNotificationModalController method recordVote not implemented');
  }

  public isVotingDone(): boolean {
    throw Error('VoteKickNotificationModalController method isVotingDone not implemented');
  }

  public endVote(): void {
    throw Error('VoteKickNotificationModalController method endVote not implemented');
  }

  public applyVote(): void {
    throw Error('VoteKickNotificationModalController method applyVote not implemented');
  }
}
