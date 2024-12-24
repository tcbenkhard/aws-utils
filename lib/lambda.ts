import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {ServerError} from "./errors";

export const wrapHandler = (lambdaFunction: (event: APIGatewayProxyEvent, context: Context) => any, statusCode: number = 200, headers: {[key:string]: string} = {}) => async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const result = await lambdaFunction(event, context)
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } catch (e) {
        if(e instanceof ServerError) {
            console.info(e)
            return {
                statusCode: e.statusCode,
                body: JSON.stringify(e)
            }
        } else {
            console.error(e)
            const serverError = ServerError.serverError("An unknown error occurred")
            return {
                statusCode: serverError.statusCode,
                body: JSON.stringify(serverError),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            }
        }
    }
}

export abstract class BaseHandler<RequestType, ResponseType> {
    constructor(
        private statusCode: number = 200,
        private headers: {[key:string]: string} = {},
        private accessControlAllowOrigin: string = '*') {}

    abstract parseEvent(event: APIGatewayProxyEvent) : Promise<RequestType>
    abstract handleRequest(request: RequestType) : Promise<ResponseType>

    public async handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        try {
            console.info("Received event:", event)
            const request = await this.parseEvent(event)
            const result = await this.handleRequest(request)
            console.info("Finished handling event", result)
            return {
                statusCode: this.statusCode,
                body: JSON.stringify(result),
                headers: {
                    ...this.headers,
                    'Access-Control-Allow-Origin': this.accessControlAllowOrigin
                }
            }
        } catch (e) {
            let responseError = e
            if(!(e instanceof ServerError)) {
                responseError = ServerError.serverError("An unknown error occurred")
            }
            console.error("Failed to handle event", e)
            return {
                statusCode: (responseError as ServerError).statusCode,
                body: JSON.stringify(responseError),
                headers: {
                    ...this.headers,
                    'Access-Control-Allow-Origin': this.accessControlAllowOrigin,
                }
            }
        }
    }
}