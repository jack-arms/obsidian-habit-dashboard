import { getContext, setContext } from "svelte";

export interface Context<T> {
  get: () => T;
  set: (ctx: T) => T;
}

export function createContext<T>(key: string): Context<T> {
  return {
    get: () => getContext<T>(key),
    set: (ctx: T) => setContext(key, ctx),
  };
}
