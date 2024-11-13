/// Wrappers around fetch to handle dev vs prod environments

import { Token } from "../contexts/Auth.tsx";
import assert from "./assert.ts";

// const BASE_URL = import.meta.env.DEV ? "localhost:8080/api/v1" : "/api/v1";
const BASE_URL = "/api/v1";

export enum Method {
    Get = "GET",
    Post = "POST",
    Put = "PUT"
}

/**
 * Call the backend API
 * @param route The route of the API function to call
 * @param method The HTTP method used for the API call
 * @param token The auth token, if it exists. Used to automatically add the Auth headers for you.
 */
export default function call(
    route: string,
    method: Method,
    token?: Token,
): Promise<Response> {
    assert(
        !route.startsWith("/api/v1"),
        "Api call utility function already prefixes api for you",
    );

    const url = route.startsWith("/")
        ? `${BASE_URL}${route}`
        : `${BASE_URL}/${route}`;

    if (token?.data) {
        return fetch(url, {
            method: method,
            headers: { Authorization: `Bearer ${token.data}` },
        });
    }

    return fetch(url, { method: method });
}
