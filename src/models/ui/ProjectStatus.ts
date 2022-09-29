import { getEnumValues } from '$/util/enum'

export enum ProjectStatus {
  new = 'new',
  working = 'working',
  delivered = 'delivered',
  archived = 'archived',
}

export const projectStatuses = getEnumValues<ProjectStatus>(ProjectStatus)
