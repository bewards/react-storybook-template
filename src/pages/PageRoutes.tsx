import { FC, Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const ProjectDetail = lazy(() => import('$/pages/ProjectDetailPage/ProjectDetailPage'))
const ProjectSwimlanes = lazy(() => import('$/pages/ProjectSwimlanesPage/ProjectSwimlanesPage'))

import { projectStatuses } from '$/models/ui/ProjectStatus'

const PageRoutes: FC = () => {
  return (
    <Suspense fallback={<div>Page is loading</div>}>
      <Routes>
        <Route path="/" element={<ProjectSwimlanes statuses={projectStatuses} />} />
        <Route path="projects/*" element={<ProjectSwimlanes statuses={projectStatuses} />} />
        <Route path="project/:projectId" element={<ProjectDetail />} />
        <Route path="project" element={<ProjectDetail />} />
      </Routes>
    </Suspense>
  )
}

export default PageRoutes
