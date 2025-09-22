import { Principal } from "@icp-sdk/core/principal";

export const Opt = <T>(value: [] | [T]): T | undefined => {
    return value.length === 0 ? undefined : value[0];
};

export const MakeOpt = <T>(value?: T | null): [] | [T] => {
    return value === null || value === undefined ? [] : [value];
};

const textEncoder = new TextEncoder();
export const StringBlobOpt = (value?: string | null): [] | [number[] | Uint8Array] => {
    if (value === null || value === undefined) return [];
    return [textEncoder.encode(value)];
};

export const PrincipalOpt = (value?: Principal | string): [] | [Principal] => {
    if (value instanceof Principal) return [value];
    if (typeof value === 'string') return [Principal.fromText(value)];
    return [];
};

export const PrincipalReq = (value: Principal | string): Principal => {
    if (value instanceof Principal) return value;
    return Principal.fromText(value);
}

export type Resp<T extends (...args: unknown[]) => Promise<unknown>> = Awaited<ReturnType<T>>;
export type OptRespPromise<T extends (...args: unknown[]) => Promise<unknown>> = Promise<Resp<T> | null | undefined>;

export function getVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: null | undefined, key: K): undefined;
export function getVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: T, key: K): Values<T, K>;
export function getVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: T | null | undefined, key: K) {
    if (!x) return undefined;
    return x[key] as Values<T, K> | undefined;
}

export function pairVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: null | undefined, key: K): undefined;
export function pairVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: T, key: K): [K, Values<T, K>];
export function pairVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: T | null | undefined, key: K):
    [K, Values<T, K>] | undefined {
    if (!x) return undefined;
    const res = x[key];
    if (res === undefined) return undefined;
    return [key, res] as [K, Values<T, K>];
}

type Keys<T> = T extends Record<infer K, unknown> ? K : never;
type Values<T, K extends Keys<T>> = T extends Record<K, infer V> ? V : never;
type KeyMatcher<T> = { [K in Keys<T>]: (val: Values<T, K>) => unknown }
export function matchVariant(x: null | undefined, matcher: KeyMatcher<unknown>): undefined;
export function matchVariant<T, M extends KeyMatcher<T>>(x: T, matcher: M): ReturnType<M[Keys<T>]>;
export function matchVariant<T, M extends Partial<KeyMatcher<T>>>(x: T, matcher: M): ReturnType<NonNullable<M[keyof M]>> | undefined;
export function matchVariant<T extends Record<string, unknown>, TRet>(
    x: T | null | undefined,
    matcher: Partial<KeyMatcher<T>>,
): TRet | undefined {
    if (x === null || x === undefined) return undefined;
    for (const [k, fn] of Object.entries(matcher)) {
        const res = x[k];
        if (res === undefined) continue;
        return (fn as (val: Values<T, Keys<T>>) => TRet)?.(res as Values<T, Keys<T>>);
    }
    return undefined;
}

export function keyVariant<T, K extends Keys<T>>(x?: T) {
    if (!x) return undefined;
    const keys = Object.keys(x);
    if (keys.length === 0) return undefined;
    return keys[0] as K;
}

export function isVariant(x: null | undefined, key: unknown): false;
export function isVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: T, key: K): boolean;
export function isVariant<T extends Record<string, unknown>, K extends Keys<T>>(x: T | null | undefined, key: K): boolean {
    return x !== null && x !== undefined && key in x;
}

type LinkList<T> = [] | [[T, LinkList<T>]];
export function* iterLinkList<T>(l: LinkList<T>): Iterable<T> {
    if (l.length === 0) {
        return;
    }
    const [[head, tail]] = l;
    yield head;
    yield* iterLinkList(tail);
}

export function formatTime(time: bigint): string {
    const ms = Number(time / 1000000n);
    return new Date(ms).toString();
}