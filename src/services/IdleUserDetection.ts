/**
 * This class is used to store the time since the last user action
 * A user action is a click or a key pressed
 */
export default class IdleUserDetection {

    // number of milliseconds user needs to be inactive
    private ms: number = 2000;

    // the timeout
    private plannedTimeout: any;

    /**
     * @param f the function to execute when the user becomes idle
     */
    public userAction(f: (() => void)): void {
        // remove previous timeouts by user action
        if (this.plannedTimeout) {
            clearTimeout(this.plannedTimeout);
        }

        this.plannedTimeout = setTimeout(f, this.ms);
    }

}