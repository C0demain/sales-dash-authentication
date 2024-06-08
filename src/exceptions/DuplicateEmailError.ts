export class DuplicateEmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DuplicateEmailError";
    }
}
