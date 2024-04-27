import type { String } from 'ts-toolbelt'

export function createRoute<TPrefix extends string, TArgs extends string[]>(
  prefix: TPrefix,
  ...args: TArgs
) {
  return [prefix, ...args].join(
    '/',
  ) as `${TPrefix}${TArgs['length'] extends 0 ? '' : `/${String.Join<TArgs, '/'>}`}`
}
