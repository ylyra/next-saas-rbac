export function createRoute(
  prefix: string,
  ...args: string[] 
) {
  return [prefix, ...args].join('/')
}