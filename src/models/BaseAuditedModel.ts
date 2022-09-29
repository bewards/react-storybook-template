import { BaseModel } from './BaseModel'

export interface BaseAuditedModel<IdType> extends BaseModel<IdType> {
  created?: string // Date as a ISOString
  modified?: string // Date as a ISOString
}
