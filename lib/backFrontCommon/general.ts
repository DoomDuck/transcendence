export type Id = number;
export type TypeMap<T> = { [Key in keyof T]: { key: Key, payload: T[Key] } }[keyof T];
