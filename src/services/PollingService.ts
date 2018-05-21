/**
 * This class is used to poll at regular interval times
 */
export default class PollingService {

    // number of milliseconds between 2 consecutive polls
    private ms: number;
    private interval: any;

    private sendPoll: () => void;

    constructor(ms: number, sendPoll: () => void) {
        this.ms = ms;
        this.sendPoll = sendPoll;
    }

    public startPolling() {
        this.schedulePoll();
    }

    public stopPolling() {
        clearInterval(this.interval);
    }

    private schedulePoll() {
        this.interval = setInterval(this.sendPoll, this.ms);
    }
}
