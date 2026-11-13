export class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code = "APP_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
//# sourceMappingURL=app-error.js.map