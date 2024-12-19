import {getEnv} from "../lib";

describe('util', () => {
    it('should return actual value if set', () => {
        process.env['testkey'] = 'testvalue'
        const val = getEnv('testkey', 'defaultvalue')
        expect(val).toBe('testvalue')
    })

    it('should return default value if not set', () => {
        const val = getEnv('defaulttestkey', 'defaultvalue')
        expect(val).toBe('defaultvalue')
    })

    it('should throw error if not set and no default', () => {
        expect(() => getEnv('missingtestkey')).toThrowError('Missing environment variable: missingtestkey')
    })
})