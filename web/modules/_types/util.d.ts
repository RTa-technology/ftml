/* eslint-disable @typescript-eslint/ban-types */
declare global {
  /** Represents any function, without using the {@link Function} object. */
  type AnyFunction<R = unknown> = (...args: any) => R

  /** Represents the eventual value of a `Promise`. */
  type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<
    infer Value
  >
    ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1]
    : Otherwise

  /** All JS primitive values. */
  type Primitive = string | number | BigInt | boolean | symbol | null | undefined

  /** _Strictly_ represents a `{ 'key': value }` object with only primitives. */
  type PlainObject = Record<string, Primitive>

  /** Represents either a value of the given type or a promise that resolves to one. */
  type Promisable<T> = T | PromiseLike<T>

  /** Matches a JSON object. */
  type JSONObject = { [Key in string]?: JSONValue }

  /** Matches a JSON array. */
  type JSONArray = JSONValue[]

  /** Matches any valid JSON value. */
  type JSONValue = string | number | boolean | null | JSONObject | JSONArray

  /** Filters a record for any properties which are equivalent to a given type. */
  type FilterFor<O extends Record<string, any>, T> = {
    [Property in keyof O as O[Property] extends T ? Property : never]: O[Property]
  }

  /** Filters out of a record any properties which are equivalent to a given type. */
  type FilterOut<O extends Record<string, any>, T> = {
    [Property in keyof O as O[Property] extends T ? never : Property]: O[Property]
  }

  /** A type which may be an array of itself, or just itself. */
  type Arrayable<T> = T | T[]

  /**
   * A type which may either be the given type or a function returning the
   * given type.
   */
  type Functionable<T, A = any, G = this> = T | ((this: G, ...args: A) => T)

  /** Represents a constructor function (a class, effectively) */
  type Constructor<T = {}, A extends any[] | void = void> = A extends any[]
    ? new (...args: A) => T
    : new () => T

  /** Represents an abstract class constructor function. */
  type AbstractClass<T = {}, A extends any[] | void = void> = A extends any[]
    ? abstract new (...args: A) => T
    : abstract new () => T

  /** Gets the methods of an object. */
  type Methods<T> = FilterFor<T, Function>
}

export {}
