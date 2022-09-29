type Enum = { [s: number]: string | number }
export const getEnumValues = <T = Enum>(enumerable: Enum): T[] => Object.keys(enumerable).map(key => enumerable[key])
