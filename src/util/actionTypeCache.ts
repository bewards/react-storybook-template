/**
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */

const typeCache: { [label: string]: boolean } = {}

export function add<T>(label: T | ''): T {
  if (typeCache[label as string]) {
    throw new Error(`Action type "${label}" is not unique"`)
  }
  typeCache[label as string] = true
  return label as T
}
