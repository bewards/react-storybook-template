import { FC } from 'react'

interface Props {
  created?: string
  modified?: string
}

export const ProjectFormMeta: FC<Props> = (props: Props) => {
  const { created, modified } = props

  if (!created && !modified) {
    return null
  }

  return (
    <div>
      {created && (
        <p className="mb-0">
          <small>
            Created: <time dateTime={created}>{new Date(created).toLocaleString('en-US')}</time>
          </small>
        </p>
      )}
      {modified && (
        <p>
          <small>
            Modified: <time dateTime={modified}>{new Date(modified).toLocaleString('en-US')}</time>
          </small>
        </p>
      )}
    </div>
  )
}
