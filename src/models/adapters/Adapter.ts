export interface Adapter<ModelAsJson, Model> {
  toModel: (json: ModelAsJson) => Model
  toJson: (object: Model) => ModelAsJson
}
