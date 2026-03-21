export type Callback<T, TReturn = unknown> = (error?: Error, result?: IteratorResult<T, TReturn>) => void;
export type IteratorCallback<T> = (callback?: Callback<T>) => void;
