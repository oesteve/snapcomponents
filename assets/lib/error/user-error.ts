export class UserError extends Error {
    type: string = "UserError";

    constructor(message: string) {
        super(message);
    }
}
