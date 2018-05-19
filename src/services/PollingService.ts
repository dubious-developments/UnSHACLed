/**
 * This class is used to poll at regular interval times
 */
export default class PollingService<T> {

    // number of milliseconds between 2 consecutive polls
    private ms: number;
    private interval: any;

    private pollingFunc: () => void;

    constructor(ms: number, pollingFunc: () => void) {
        this.ms = ms;
        this.pollingFunc = pollingFunc;
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
        this.pollingFunc();
    }
}