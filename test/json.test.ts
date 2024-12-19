import {parseBody} from "../lib/json";
import {z} from "zod";
import {ServerError} from "../lib";

describe('Json utils', () => {
    it('should raise on missing body', () => {
        expect(() => parseBody(null, z.object({}))).toThrow(ServerError)
    })

    it('should raise on invalid json', () => {
        expect(() => parseBody('{"name":', z.object({}))).toThrow(ServerError)
    })

    it('should parse json', () => {
        const result = parseBody('{"name": "test"}', z.object({name: z.string()}))
        expect(result).toEqual({name: "test"})
    })
})