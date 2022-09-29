import { StatusToggle } from '$/components/StatusToggle/StatusToggle'
import { projectStatuses } from '$/models/ui/ProjectStatus'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  component: StatusToggle,
  title: 'Components / Status Toggle',
} as ComponentMeta<typeof StatusToggle>

export const Default: ComponentStory<typeof StatusToggle> = args => {
  const { itemVisibility, items, onItemClicked } = args

  return (
    <>
      <h3>Projects By Status</h3>
      <StatusToggle onItemClicked={onItemClicked} itemVisibility={itemVisibility} items={items} />
    </>
  )
}

Default.args = {
  itemVisibility: {
    new: true,
    working: false,
    delivered: true,
    archived: true,
  },
  items: projectStatuses,
  onItemClicked: (status: string) => {
    window.alert(`status item "${status}" click`)
  },
}

Default.parameters = {
  controls: { expanded: true },
}

Default.argTypes = {
  itemVisibility: {
    description:
      'Set the default state of the items. The keys in this object must match the strings provided to the items array',
  },
}
