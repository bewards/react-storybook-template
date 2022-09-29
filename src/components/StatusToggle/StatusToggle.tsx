import { FC } from 'react'
import { KeyBoolean } from '$/models/ui/KeyBoolean'
import { titleCase } from '$/util/text'
import { ProjectStatus } from '$/models/ui/ProjectStatus'
import { statusColorMap } from '$/util/colors'
import { useIntl } from 'react-intl'
import messages from './messages'

interface Props {
  itemVisibility: KeyBoolean
  items: ProjectStatus[]
  onItemClicked: (item: string) => void
}

const handleItemClicked = (item: string, props: Props) => () => {
  props.onItemClicked(item)
}

export const StatusToggle: FC<Props> = (props: Props) => {
  const { items = [], itemVisibility } = props
  const intl = useIntl()
  return (
    <>
      <nav className="mr-auto d-flex" data-testid="status-navbar">
        <div className="align-items-center d-flex" id="basic-nav-dropdown" data-testid="status-dropdown">
          <span className="mr-4">
            <h2>{intl.formatMessage(messages.filter)}</h2>
          </span>
          {items.map((s, index) => (
            <div
              key={index}
              className={`btn btn-${statusColorMap[s]} pb-0 ml-${index ? '2' : 0}`}
              data-testid={`${s}_toggle`}
              onClick={handleItemClicked(s, props)}
              onKeyDown={e => {
                if (e.key === 'Space') {
                  handleItemClicked(s, props)
                }
              }}
              role="checkbox"
              tabIndex={index}
              aria-checked={itemVisibility[s]}>
              <input id={`cb-${s}`} type="checkbox" defaultChecked={!!itemVisibility[s]}></input>
              <label className="ml-2" style={{ pointerEvents: 'none' }} htmlFor={`cb-${s}`}>
                {titleCase(s)}
              </label>
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
