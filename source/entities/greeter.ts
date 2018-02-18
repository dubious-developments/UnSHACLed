class Greeter implements GreeterInterface {
    public greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    public greet() {
        return `Hello, ${this.greeting}`;
    }
}

export default Greeter;
