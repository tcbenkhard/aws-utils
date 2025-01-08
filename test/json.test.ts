import {parseBody} from "../lib/json";
import {z} from "zod";
import {ServerError} from "../lib";
import exp = require("node:constants");

const objectWithExtras = z.object({
    name: z.string(),
    extraName: z.string()
})

describe('Json utils', () => {
    it('should not raise on missing body', () => {
        const result = parseBody(null, z.object({}))
        expect(result).toEqual({})
    })

    it('should raise on invalid json', () => {
        expect(() => parseBody('{"name":', z.object({}))).toThrow(ServerError)
    })

    it('should parse json', () => {
        const result = parseBody('{"name": "test"}', z.object({name: z.string()}))
        expect(result).toEqual({name: "test"})
    })

    it('should add extras', () => {
        const result = parseBody('{"name": "test"}', objectWithExtras, {
            extraName: "superExtra"
        })

        expect(result).toEqual({
            name: "test",
            extraName: 'superExtra'
        })
    })
})