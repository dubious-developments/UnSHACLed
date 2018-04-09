export class ValidationReport {

    private report: any;
    private conforms: boolean;

    public constructor(report: any) {
        this.report = report;
        if (report) {
            this.conforms = report.conforms();
        } else {
            this.conforms = false;
        }
    }

    public isConforming(): boolean {
        return this.conforms;
    }

    /**
     * This is a stub implementation used for testing.
     * @param {ValidationReport} other
     */
    public merge(other: ValidationReport) {
        this.conforms = this.conforms && other.conforms;
    }
}