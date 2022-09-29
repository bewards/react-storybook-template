export const titleCase = (value = ''): string => {
  return value.replace(/(^|\s)\S/g, t => t.toUpperCase())
}
