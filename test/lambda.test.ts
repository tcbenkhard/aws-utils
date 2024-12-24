import {wrapHandler} from "../lib";
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {TestHandler, UnexpectedErrorHandler} from "./mockHandler";

describe('Lambda wrapper function', () => {
    it('should return actual value if successful', async () => {
        const wrapped = wrapHandler(() => ({name: "test"}))
        const result = await wrapped({} as APIGatewayProxyEvent, {} as Context)
        expect(result.statusCode).toBe(200)
        expect(result.body).toBe(JSON.stringify({name: "test"}))
    })

    it('should return a server error 500 if an error occurs', async () => {
        const wrapped = wrapHandler(() => {throw new Error("unknown error")})
        const result = await wrapped({} as APIGatewayProxyEvent, {} as Context)
        expect(result.statusCode).toBe(500)
        expect(result.body).toBe(JSON.stringify({
            statusCode: 500,
            errorCode: "UNKNOWN_ERROR",
            errorMessage: "An unknown error occurred"
        }))
    })
})

describe('Lambda Base Handler', () => {
    it('should return actual value if successful', async () => {
        const result = await new TestHandler().handle({} as APIGatewayProxyEvent, {} as Context)
        expect(result).toStrictEqual({
            "body": "\"Dit is een test\"",
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "statusCode": 200
        })
    })

    it('should return 500 error when unexected error happens', async () => {
        const result = await new UnexpectedErrorHandler().handle({} as APIGatewayProxyEvent, {} as Context)
        await expect(result).toStrictEqual({
            "body": "{\"statusCode\":500,\"errorCode\":\"UNKNOWN_ERROR\",\"errorMessage\":\"An unknown error occurred\"}",
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "statusCode": 500
        })
    })
})
