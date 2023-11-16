export default class VoteKick {
  protected _votes: boolean[];

  public constructor() {
    this._votes = [];
  }

  public get votes(): boolean[] {
    return this._votes;
  }

  public addVote(vote: boolean): void {
    throw Error('VoteKick method addVote not implemented');
  }

  public applyVote(): void {
    throw Error('VoteKick method applyVote not implemented');
  }
}
