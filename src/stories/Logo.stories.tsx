import { ReactComponent as Logo } from '../logo.svg'
import { ComponentStory } from '@storybook/react'

export default { component: Logo, title: 'How To' }

export const Default: ComponentStory<typeof Logo> = () => {
  return <Logo />
}

Default.story = {
  name: 'Use an SVG as a Component',
}

Default.parameters = {
  viewMode: 'docs',
}
