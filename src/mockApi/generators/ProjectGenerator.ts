import * as faker from 'faker'
import cuid from 'cuid'
import { Project } from '$/models/ui/Project'
import { randomFromArray } from '$/lib/api-mocking/util/array'
import { projectStatuses } from '$/models/ui/ProjectStatus'
import { ObjectGenerator } from '$/lib/api-mocking/interfaces/ObjectGenerator'

export const ProjectGenerator: ObjectGenerator<Project, string> = {
  generateId: (): string => {
    return cuid()
  },

  generateList: (count: number): Project[] => {
    const divisions = Array.from({ length: 5 }, () => faker.commerce.department())
    const owners = Array.from({ length: 10 }, () => `${faker.name.firstName()} ${faker.name.lastName()}`)
    return Array.from({ length: count }, (): Project => {
      const created = faker.date.between('01/01/2018', '12/31/2020')
      return {
        id: ProjectGenerator.generateId(),
        title: faker.company.companyName(),
        division: randomFromArray(divisions),
        owner: randomFromArray(owners),
        budget: faker.finance.amount(5000, 500000, 2),
        status: randomFromArray(projectStatuses),
        created: created.toISOString(),
        modified: faker.date.future(1, created).toISOString(),
      }
    }) as Project[]
  },
}
