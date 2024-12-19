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
            const serverError = ServerError.serverError("UNKNOWN_ERROR", "An unknown error occurred")
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