import TownController from "../TownController";

export default class VoteKickNotificationModalController {
    protected _townController: TownController
    
    protected _model: string

    constructor(townController: TownController) {
        this._townController = townController;
    }

    public recordVote(vote: boolean): void {

    }

    public isVotingDone(): boolean {
        return true;
    }
}