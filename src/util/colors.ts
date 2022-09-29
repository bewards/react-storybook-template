import { ProjectStatus } from '$/models/ui/ProjectStatus'

export const statusColorMap = {
  [ProjectStatus.archived]: 'secondary',
  [ProjectStatus.delivered]: 'dark',
  [ProjectStatus.new]: 'success',
  [ProjectStatus.working]: 'warning',
}
