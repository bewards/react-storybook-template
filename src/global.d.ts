import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

// source https://github.com/testing-library/jest-dom/issues/439

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}
