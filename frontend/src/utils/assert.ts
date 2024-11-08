interface Assert {
    (condition: boolean, message?: string): asserts condition;

    nonNullable: <T>(
        value: T,
        message?: string,
    ) => asserts value is NonNullable<T>;
}

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
    const assert = ((
        condition: boolean,
        message = "Assertion failed",
    ): asserts condition => {
        if (import.meta.env.DEV) {
            if (!condition) {
                throw new DevAssertionError(message);
            }
        }
    }) as Assert;

    assert.nonNullable = <T>(
        value: T,
        message = "Value must not be null or undefined",
    ): asserts value is NonNullable<T> => {
        assert(value != null, message);
    };

    return assert;
};

const assert = createDevAssert();

export default assert;
