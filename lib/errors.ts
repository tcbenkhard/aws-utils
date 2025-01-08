export class ServerError extends Error {
    statusCode: number
    errorCode: string
    errorMessage: string

    constructor(statusCode: number, errorCode: string, errorMessage: string) {
        super(errorMessage);
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.errorMessage = errorMessage
    }

    static notFound(errorCode: string, errorMessage: string) {
        return new ServerError(404, errorCode, errorMessage)
    }

    static serverError(errorMessage: string) {
        return new ServerError(500, "UNKNOWN_ERROR", errorMessage)
    }

    static badRequest(errorCode: string, errorMessage: string) {
        return new ServerError(400, errorCode, errorMessage)
    }

    static unauthorized(errorCode: string, errorMessage: string) {
        return new ServerError(401, errorCode, errorMessage)
    }

    static forbidden(errorCode: string = "FORBIDDEN", errorMessage: string = "Insufficient permissions") {
        return new ServerError(403, errorCode, errorMessage)
    }
}