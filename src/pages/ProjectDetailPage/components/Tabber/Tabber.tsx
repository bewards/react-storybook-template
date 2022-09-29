import { ReactChild, JSXElementConstructor, ReactElement, useState } from 'react'
import classNames from 'classnames'

// Styles
import styles from './Tabber.module.scss'

// Types
import { ITabObject } from './types'
interface Props {
  children?: ReactChild
  data: ITabObject[]
}

export function Tabber(props: Props): ReactElement {
  const { children, data } = props
  const [visibleTab, setVisibleTab] = useState<string>(data[0].id)
  const tabsClass = classNames([styles.tabs, 'mt-4'])

  return (
    <>
      <ul className={tabsClass}>
        {/* Clickable tab titles */}
        {data.map((item: ITabObject): ReactElement => {
          const { id, tabTitle } = item
          const isTabActive = visibleTab === id
          const tabTitleClass = classNames(
            {
              'active btn-primary': isTabActive,
              'btn-secondary': !isTabActive,
            },
            [styles.tab],
            'nav-item btn nav-item-active'
          )
          const handleClick = (): void => setVisibleTab(id)

          return (
            <li
              key={id}
              className={tabTitleClass}
              role="tab"
              aria-selected={isTabActive ? 'true' : 'false'}
              onClick={handleClick}
              onKeyDown={handleClick}
              data-testid={`tab-${id}`}>
              {tabTitle}
            </li>
          )
        })}
      </ul>
      <>
        {/* Any content in between? */}
        {children}

        {/* Child content per selected tab */}
        {data.map((item: ITabObject): ReactElement => {
          const { id, tabComponent, tabTitle } = item

          return (visibleTab === id && (
            <div className={classNames(styles['content-wrapper'])} key={id}>
              {/* Subtitle */}
              <h2 className={classNames(styles.subtitle)}>{tabTitle}</h2>

              {/* Render the component */}
              {tabComponent}
            </div>
          )) as ReactElement<never, string | JSXElementConstructor<unknown>>
        })}
      </>
    </>
  )
}
