export const getEnv = (key: string, defaultValue?: string): string => {
    const actualValue = process.env[key];
    if (!actualValue && !defaultValue) throw new Error(`Missing environment variable: ${key}`);
    return actualValue || defaultValue!;
}