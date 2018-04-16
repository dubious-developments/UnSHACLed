/**
 * This class is used to store the time since the last user action
 * A user action is a click or a key pressed
 */
class TimingService {

    // number of milliseconds user needs to be inactive
    private ms: number = 2000;

    // the function planned to execute after timeout
    plannedTimeout: any;

    public userAction(): void {
        // remove previous timeouts by user action
        if (this.plannedTimeout) {
            clearTimeout(this.plannedTimeout);
        }

        this.plannedTimeout = setTimeout(this.userIdle, this.ms);
    }

    public userIdle(): void {
        console.log("idle");
    }

}

export default TimingService;