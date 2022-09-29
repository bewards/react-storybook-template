import type { Adapter } from '$/models/adapters/Adapter'
import type { BaseAuditedModel } from '$/models/BaseAuditedModel'
import { ObjectGenerator } from '$/lib/api-mocking/interfaces/ObjectGenerator'

/**
 * This is a simple Crud service that can be used to implement API contracts. It must be extended and provided
 * an ObjectGenerator when instantiated. Upon instantiation it will use the generator to generate a data set that will be indexed and
 * can be modified using the crud operation provided by this service.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export abstract class CrudService<
  Model extends BaseAuditedModel<IdType>,
  ModelAsJson,
  IdType extends keyof number | string
> {
  public generator: ObjectGenerator<Model, IdType>
  public modelList: Model[]
  private adapter: Adapter<ModelAsJson, Model>
  public modelsById: Record<IdType, Model>

  protected constructor(
    adapter: Adapter<ModelAsJson, Model>,
    generator: ObjectGenerator<Model, IdType>,
    numberToGenerate: number
  ) {
    this.adapter = adapter
    this.generator = generator
    this.modelList = this.generator.generateList(numberToGenerate)
    this.modelsById = {} as Record<IdType, Model>
    this.modelList.forEach(model => {
      if (!model.id) {
        throw new Error(
          `Unable to initialize CRUD Service because the following model is missing an id. \n${JSON.stringify(
            model,
            null,
            2
          )}`
        )
      }

      this.modelsById[model.id] = model
    })
  }

  listAll(): ModelAsJson[] {
    return this.modelList.map(project => this.adapter.toJson(project))
  }

  findById(id: IdType): ModelAsJson {
    return this.adapter.toJson(this.modelsById[id])
  }

  insert(jsonModel: ModelAsJson): ModelAsJson {
    const modelToInsert = this.adapter.toModel(jsonModel)
    modelToInsert.id = this.generator.generateId()
    modelToInsert.created = new Date().toISOString()
    modelToInsert.modified = new Date().toISOString()
    this.modelList.push(modelToInsert)
    this.modelsById[modelToInsert.id] = modelToInsert
    return this.adapter.toJson(modelToInsert)
  }

  update(jsonModel: ModelAsJson): ModelAsJson {
    const model = this.adapter.toModel(jsonModel)
    if (!model.id) {
      throw new Error(
        `Unable to update the following object because it is missing an id. \n${JSON.stringify(model, null, 2)}`
      )
    }
    const modelToUpdate = this.modelsById[model.id]
    Object.assign(modelToUpdate, this.adapter.toModel(jsonModel))
    modelToUpdate.modified = new Date().toISOString()
    return this.adapter.toJson(modelToUpdate)
  }

  delete(id: IdType): void {
    delete this.modelsById[id]

    const tempModels: Model[] = []
    for (let i = 0; i < this.modelList.length; i++) {
      const model = this.modelList[i]
      if (id !== model.id) {
        tempModels.push(model)
      }
    }

    this.modelList = tempModels
  }
}
