import { ComponentTest } from '$/lib/rtl-utils/ComponentTest'
import { RootState } from '$/models/ui/RootState'
import { Store } from 'redux'
import { ComponentType } from 'react'
/**
 * This is just a convenience function to make initializing tests require less typing.
 */
export const newComponentTest = <ComponentProps>(
  componentUnderTest: ComponentType<ComponentProps>
): ComponentTest<ComponentProps, Store<RootState>> => {
  return new ComponentTest<ComponentProps, Store<RootState>>(componentUnderTest)
}
