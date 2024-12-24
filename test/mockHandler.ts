import {BaseHandler} from "../lib/lambda";
import {APIGatewayProxyEvent} from "aws-lambda";

export class TestHandler extends BaseHandler<string, string> {
    async handleRequest(request: string): Promise<string> {
        return "Dit is een test"
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<string> {
        return "Wow"
    }
}

export class UnexpectedErrorHandler extends BaseHandler<string, string> {
    async handleRequest(request: string): Promise<string> {
        return "Dit is een test"
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<string> {
        throw Error("Unexpected error")
    }
}