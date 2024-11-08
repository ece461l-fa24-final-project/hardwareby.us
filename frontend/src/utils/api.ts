/// Wrappers around fetch to handle dev vs prod environments

import { Token } from "../contexts/Auth.tsx";
import assert from "./assert.ts";

const BASE_URL = import.meta.env.DEV ? "localhost:8080/api/v1" : "/api/v1";

export enum Method {
    Get = "GET",
    Post = "POST",
}

export default function call(
    route: string,
    method: Method,
    token?: Token,
): Promise<Response> {
    // if (route.startsWith("/api/v1")) {
    //   throw new Error(
    //     "This utility functions already add the base api prefix for you!"
    //   );
    // }
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
