import InvalidParametersError, {
  PLAYER_ALREADY_VOTED_MESSAGE,
} from '../lib/InvalidParametersError';
import Player from '../lib/Player';
import { PlayerID } from '../types/CoveyTownSocket';

/**
 * Model for a vote kick, used to record votes and determine the result of the vote
 */
export default class VoteKick {
  protected _votes: { [playerID: PlayerID]: boolean };

  public constructor() {
    this._votes = {};
  }

  public set playerIDToKick(player: PlayerID) {
    this.playerIDToKick = player;
  }

  public get playerIDToKick(): PlayerID {
    return 'test';
  }

  /**
   * Getter for the votes
   */
  public get votes(): { [playerID: PlayerID]: boolean } {
    return this._votes;
  }

  /**
   * Getter for the player ID to kick
   */

  /**
   * Adds a vote to the private votes dictionary, throws an error if the player has already voted
   * @param playerID the player ID of the player who is voting
   * @param vote true if the player votes to kick the player, false if the player votes to not kick the player
   */
  public addVote(playerID: PlayerID, vote: boolean): void {
    if (this._votes[playerID] === undefined) {
      this._votes[playerID] = vote;
    } else {
      throw new InvalidParametersError(PLAYER_ALREADY_VOTED_MESSAGE);
    }
  }

  /**
   * Checks if the player has voted
   * @param playerID the player ID of the player to check
   * @returns true if the player has voted, false otherwise
   */
  public hasVoted(playerID: PlayerID): boolean {
    return this._votes[playerID] !== undefined;
  }

  /**
   * Checks if a vote kick is successful
   * @returns true if the vote kick is successful (the player in question should be kicked), false otherwise
   */
  public voteKickSuccessful(): boolean {
    let numKickVotes = 0;
    for (const playerID in this._votes) {
      if (this._votes[playerID] === true) {
        numKickVotes++;
      } else {
        numKickVotes--;
      }
    }
    if (numKickVotes > 0) {
      return true;
    }
    return false;
  }
}
