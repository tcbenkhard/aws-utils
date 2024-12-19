import {wrapHandler} from "../lib/lambda";
import {APIGatewayProxyEvent, Context} from "aws-lambda";

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