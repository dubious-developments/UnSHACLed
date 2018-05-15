/**
 * This class is used to poll at regular interval times
 */
export default class PollingService {

    // number of milliseconds between 2 consecutive polls
    private ms: number;

    private interval: any;

    constructor(ms: number) {
        this.ms = ms;
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

    private sendPoll() {
        // TODO send request here
        console.log("pol");
    }
}
