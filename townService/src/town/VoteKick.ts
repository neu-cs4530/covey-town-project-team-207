import InvalidParametersError, {
  PLAYER_ALREADY_VOTED_MESSAGE,
} from '../lib/InvalidParametersError';
import { Player, PlayerID } from '../types/CoveyTownSocket';

/**
 * Model for a vote kick, used to record votes and determine the result of the vote
 */
export default class VoteKick {
  private _votes: { [playerID: PlayerID]: boolean };

  private _playerToKick: Player;

  public constructor(playerToKick: Player) {
    this._votes = {};
    this._playerToKick = playerToKick;
  }

  /**
   * Getter for the votes
   */
  public get votes(): { [playerID: PlayerID]: boolean } {
    return this._votes;
  }

  /**
   * Getter for the player to kick
   */
  public get playerToKick(): Player {
    return this._playerToKick;
  }

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

  public isVotingDone(players: Player[]): boolean {
    const numPlayers = players.length;
    let numKickVotes = 0;
    let numNoKickVotes = 0;
    let votingDone = false;
    players.forEach(player => {
      if (this.hasVoted(player.id) && this._votes[player.id]) {
        numKickVotes++;
      } else if (this.hasVoted(player.id) && !this._votes[player.id]) {
        numNoKickVotes++;
      }
      if (numKickVotes > numPlayers / 2 || numNoKickVotes > numPlayers / 2) {
        votingDone = true;
      }
    });
    return votingDone;
  }
}
