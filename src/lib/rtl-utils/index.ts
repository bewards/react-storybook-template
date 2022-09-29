import { expect } from 'vitest'
import { act, createEvent, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { formatUrlPattern } from '$/lib/api-mocking/loadContracts'
import { RenderedTest } from './interfaces/Test'

type MockDragEvent = Omit<DragEvent, 'dataTransfer'> & { dataTransfer: Partial<DataTransfer> | null }

/**
 * If your assertions are running before async actions have completed, you can manually force the promise handlers fire
 * by flushing the queue using this function. This isn't necessarily the best way to handle this, but it an efficient
 * way in cases where you know that you only need to wait one tick of the event loop. Another way to handle this
 * that is recommended by the React Testing Library team is to `await` one of the prebuilt polling functions they built:
 * `findBy`, `findAllBy`, `waitFor`, or `waitForElementToBeRemoved`
 * see https://testing-library.com/docs/react-testing-library/cheatsheet/#async
 */
export async function flushAsyncQueue(): Promise<void> {
  // eslint-disable-next-line
  await act(async () => {})
}

/**
 * This will retrieve the request payload that was sent for the last API call made that matches the provided url pattern
 * @param test instance.
 * @param urlPattern - express style URL pattern.
 */
export function requestPayload<ComponentProps, AppStateStore>(
  test: RenderedTest<ComponentProps, AppStateStore>,
  urlPattern: string
): unknown | undefined {
  const lastOptions = test.fetchMock.lastOptions(formatUrlPattern(urlPattern))
  if (lastOptions && lastOptions.body) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return JSON.parse(lastOptions.body)
  }
}

/**
 * This will ensure that a fetch call was made during your test that matches the
 * provided URL pattern and the expected request payload. If not, the test will fail.
 * @param test - test instance.
 * @param urlPattern - express style URL pattern.
 * @param toMatch - an object that contains the data that you expect to be present in the request payload
 */
export function expectApiCall<ComponentProps, AppStateStore, Payload>(
  test: RenderedTest<ComponentProps, AppStateStore>,
  urlPattern: string,
  toMatch: Payload
): void {
  expect(requestPayload(test, urlPattern)).toMatchObject(toMatch)
}

/**
 * This will ensure that a fetch call was made during your test that matches the
 * provided URL pattern. If not, the test will fail.
 * @param test - test instance.
 * @param urlPattern - express style URL pattern.
 */
export function expectRequestMade<ComponentProps, AppStateStore>(
  test: RenderedTest<ComponentProps, AppStateStore>,
  urlPattern: string
): void {
  expect(test.fetchMock.called(formatUrlPattern(urlPattern))).toBe(true)
}

/**
 * This will ensure that history.push() was called during your test with a location that matches the url provided.
 * If not, the test will fail.
 * @param test - test instance
 * @param urlPattern - express style URL pattern.
 */
export function expectNavigatedTo<ComponentProps, AppStateStore>(
  test: RenderedTest<ComponentProps, AppStateStore>,
  urlPattern: string
): void {
  expect(test.navigateSpy).toBeCalledWith(expect.stringContaining(urlPattern))
}

/**
 * This is a function used internally that allows testUtil APIs to accept an element or data-testid
 * @param elementOrDataTestId
 */
export function getElement(elementOrDataTestId: string | Element | null): HTMLElement {
  if (typeof elementOrDataTestId === 'string') {
    return screen.getByTestId(elementOrDataTestId)
  } else {
    return elementOrDataTestId as HTMLElement
  }
}

/**
 * This is a function used internally that allows testUtil APIs to accept an element or data-testid
 * @param elementOrDataTestId
 */
export function findElement(elementOrDataTestId: string | Element | null): Promise<HTMLElement> {
  if (typeof elementOrDataTestId === 'string') {
    return screen.findByTestId(elementOrDataTestId)
  } else {
    return Promise.resolve(elementOrDataTestId as HTMLElement)
  }
}

/**
 * src is the element that you want to drag, and dst is the element that you want drop it into. For example:
 * const component = render(<Component ... />)
 * dragTo(
 *  component.getByText('drag me'),
 *  component.getByText('drop here'),
 * )
 * @param draggedComponent
 * @param dropTarget
 */
export function dragTo(draggedComponent: string | Element | null, dropTarget: string | Element | null): void {
  const dataTransferData = {}

  const dataTransferObject = {
    setData: (format: string, data: unknown) => {
      dataTransferData[format] = data
    },
    getData: (format: string) => {
      return dataTransferData[format]
    },
  }

  const draggedElement = getElement(draggedComponent)
  const droppedIntoElement = getElement(dropTarget)

  const dragStartEvent = createEvent.dragStart(draggedElement) as MockDragEvent
  dragStartEvent.dataTransfer = dataTransferObject
  fireEvent(draggedElement, dragStartEvent)

  const dragEnterEvent = createEvent.dragEnter(droppedIntoElement) as MockDragEvent
  dragEnterEvent.dataTransfer = dataTransferObject
  fireEvent(droppedIntoElement, dragEnterEvent)

  const dragOverEvent = createEvent.dragOver(droppedIntoElement) as MockDragEvent
  dragOverEvent.dataTransfer = dataTransferObject
  fireEvent(droppedIntoElement, dragOverEvent)

  const dropEvent = createEvent.drop(droppedIntoElement) as MockDragEvent
  dropEvent.dataTransfer = dataTransferObject
  fireEvent(droppedIntoElement, dropEvent)

  const dragEndEvent = createEvent.dragEnd(draggedElement) as MockDragEvent
  dragEndEvent.dataTransfer = dataTransferObject
  fireEvent(draggedElement, dragEndEvent)
}

/**
 * This is a convenience function that makes code read slightly more straight forward.
 * @param elementOrDataTestId
 */
export function expectInputValue<T = string>(elementOrDataTestId: string | Element | null): Vi.Assertion<T> {
  const inputElement = getElement(elementOrDataTestId) as HTMLInputElement
  return expect(inputElement.value)
}

/**
 * This is a convenience function that will clear the input and text areas of the given form.
 * @param formRefOrDataTestId
 */
export function clearForm(formRefOrDataTestId: string | Element | null): void {
  const form = getElement(formRefOrDataTestId)
  form.querySelectorAll('input, textarea').forEach(e => {
    if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) {
      userEvent.clear(e)
    }
  })
}

/**
 * This is a convenience function that will clear the value of and input.
 * @param elementOrDataTestId
 */
export function clearInput(elementOrDataTestId: string | Element | null): void {
  const textField = getElement(elementOrDataTestId) as HTMLInputElement
  userEvent.clear(textField)
}

/**
 * This simulates user keyboard input on the given input element.
 * @param elementOrDataTestId
 * @param value - the value you want to input into the element
 */
export async function type(elementOrDataTestId: string | Element | null, value: string | number): Promise<void> {
  const textField = await findElement(elementOrDataTestId)
  // some handlers of typing events need to run async state updates before .value is updated (ie. formik) - { delay: 1 } allows that
  //   https://github.com/testing-library/user-event/issues/539
  await userEvent.type(textField, `${value}`, { delay: 1 })
  fireEvent.blur(textField)
}

/**
 * This simulates a user selection on the given select element.
 * @param elementOrDataTestId
 * @param value - the value you want to input into the element
 */
export function selectOption(elementOrDataTestId: string | Element | null, value: string): void {
  const dropdown = getElement(elementOrDataTestId)
  userEvent.selectOptions(dropdown, value)
  fireEvent.blur(dropdown)
}

/**
 * This simulates a user click on the given element.
 * @param buttonOrDataTestId
 */
export function click(buttonOrDataTestId: string | Element | null): void {
  userEvent.click(getElement(buttonOrDataTestId))
}

/**
 * This simulates a user hover on the given element.
 * @param buttonOrDataTestId
 */
export function hover(buttonOrDataTestId: string | Element | null): void {
  fireEvent.mouseOver(getElement(buttonOrDataTestId))
}

/**
 * There are limitations to what jsDom is able to provide and submitting forms via a submit button is one of them.
 * See the explanation here: https://github.com/jsdom/jsdom/issues/1937
 * This function provides a suitable work-around.
 * @param formRefOrDataTestId
 */
export function submitForm(formRefOrDataTestId: string | Element | null): void {
  fireEvent.submit(getElement(formRefOrDataTestId))
}

/**
 * checks for the existence of the given data-testid in the DOM.
 * @param testId
 */
export function exists(testId: string): boolean {
  return !!screen.queryByTestId(testId)
}
