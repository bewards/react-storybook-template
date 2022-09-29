/* eslint-disable @typescript-eslint/ban-types */
import { vi } from 'vitest'
import { RtlUtilsConfig } from './interfaces/RtlUtilsConfig'

/**
 * rtl-utils does its clean up at a different time than the default behavior of RTL.
 * The following import disables the default cleanup behavior of RTL.
 */
import '@testing-library/react/dont-cleanup-after-each'
import Module from 'module'

const mockNavigate = vi.fn()
const actualReactRouterDOM: Module = await vi.importActual('react-router-dom')
vi.mock('react-router-dom', () => ({
  ...actualReactRouterDOM,
  useNavigate: vi.fn(() => mockNavigate),
}))

let rtlUtilsConfig: RtlUtilsConfig<unknown> | null = null

export const initRtlUtils = <AppStateStore>(config: RtlUtilsConfig<AppStateStore>): void => {
  rtlUtilsConfig = config as RtlUtilsConfig<unknown>

  rtlUtilsConfig.mockNavigate = mockNavigate
}

export const getRtlUtilsConfig = <AppStateStore>(): RtlUtilsConfig<AppStateStore> => {
  if (!rtlUtilsConfig) {
    throw new Error('React Test Utils must be initialized in setupTests.js')
  }
  return rtlUtilsConfig as RtlUtilsConfig<AppStateStore>
}
