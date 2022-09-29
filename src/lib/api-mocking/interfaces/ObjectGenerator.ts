export interface ObjectGenerator<Model, IdType> {
  generateId: () => IdType
  generateList: (count: number) => Model[]
}
