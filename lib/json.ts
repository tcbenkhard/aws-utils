import {ZodSchema} from "zod";
import {ServerError} from "./errors";

export class ParsingException extends Error {}

export const parseBody = (body: string | null, schema: ZodSchema<any>) => {
    if(!body) throw ServerError.badRequest("MISSING_BODY", "Missing body")
    try {
        const jsonBody = JSON.parse(body)
        return schema.parse(jsonBody)
    } catch (e) {
        throw ServerError.badRequest("INVALID_REQUEST_BODY", "Failed to process request body")
    }
}