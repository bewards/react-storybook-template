export const randomFromArray = <T = string>(values: T[]): T => {
  return values[Math.max(Math.round(Math.random() * values.length - 1), 0)]
}
