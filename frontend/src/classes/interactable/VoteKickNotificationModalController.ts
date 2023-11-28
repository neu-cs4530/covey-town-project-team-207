import TownController from '../TownController';
import VoteKick from '../../../../townService/src/town/VoteKick';

/**
 * Controller for the vote kick notification modal, used to record and apply votes at the end of a vote kick
 */
export default class VoteKickNotificationModalController {
  protected _townController: TownController;

  protected _model: VoteKick;

  constructor(townController: TownController, model: VoteKick) {
    this._townController = townController;
    this._model = model;
  }

  /**
   * Records a vote by adding the player's vote to the model
   * @param vote - true if the player votes to kick the player, false if the player votes to not kick the player
   */
  public recordVote(vote: boolean): void {
    this._model.addVote(this._townController.ourPlayer.id, vote);
  }

  /**
   * Checks if the vote kick is done
   * @returns true if the vote kick is done, false otherwise
   */
  public isVotingDone(): boolean {
    const numPlayers = this._townController.players.length;
    let numKickVotes = 0;
    let numNoKickVotes = 0;
    this._townController.players.forEach(player => {
      if (numKickVotes > numPlayers / 2 || numNoKickVotes > numPlayers / 2) {
        return true;
      } else if (this._model.hasVoted(player.id)) {
        numKickVotes++;
      } else {
        numNoKickVotes++;
      }
    });
    return false;
  }

  /**
   * Applies the vote kick, kicking the player if the vote is successful
   * @returns true if the vote kick is successful, false otherwise
   */
  public applyVote(): boolean {
    if (this._model.voteKickSuccessful()) {
      if (this._townController.ourPlayer.id === this._model._playerIDToKick.id) {
        this._townController.kickOurPlayer();
      }
      return true;
    }
    return false;
  }
}
