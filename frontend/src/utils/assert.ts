// ) => asserts value is NonNullable<T>;
//     message?: string,
//     value: T,
// nonNullable: <T>(
type Assert = (condition: boolean, message?: string) => asserts condition;

/**
 * Custom error for development assertions
 */
class DevAssertionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DevAssertionError";
    }
}

/**
 * Creates an assertion function that only runs in development mode
 * In production, the assertions are removed by the bundler
 */
const createDevAssert = () => {
    // assert.nonNullable = <T>(
    //     value: T,
    //     message = "Value must not be null or undefined",
    // ): asserts value is NonNullable<T> => {
    //     assert(value != null, message);
    // };

    return ((
        condition: boolean,
        message = "Assertion failed",
    ): asserts condition => {
        if (import.meta.env.DEV) {
            if (!condition) {
                throw new DevAssertionError(message);
            }
        }
    }) as Assert;
};

const assert: Assert = createDevAssert();

export default assert;
