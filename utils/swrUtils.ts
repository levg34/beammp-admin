export function fetcher(...args: [RequestInfo, RequestInit | undefined]): Promise<any> {
    return fetch(...args).then(res => res.json());
}