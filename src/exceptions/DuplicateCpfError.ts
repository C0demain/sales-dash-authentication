export class DuplicateCpfError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DuplicateCpfError";
    }
}
