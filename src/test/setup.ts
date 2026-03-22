import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

const originalSetTimeout = globalThis.setTimeout
const originalClearTimeout = globalThis.clearTimeout
const activeTimeouts = new Set<ReturnType<typeof setTimeout>>()

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  disconnect() {}

  observe(target: Element) {
    this.callback(
      [
        {
          isIntersecting: false,
          target,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 0,
          intersectionRect: new DOMRectReadOnly(),
          rootBounds: null,
          time: Date.now(),
        },
      ],
      this,
    )
  }

  takeRecords() {
    return []
  }

  unobserve() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

Object.defineProperty(globalThis, 'setTimeout', {
  writable: true,
  configurable: true,
  value: (((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const timer = originalSetTimeout(() => {
      activeTimeouts.delete(timer)

      if (typeof handler === 'function') {
        handler(...args)
        return
      }

      globalThis.eval(handler)
    }, timeout)

    activeTimeouts.add(timer)

    return timer
  }) as unknown) as typeof setTimeout,
})

Object.defineProperty(globalThis, 'clearTimeout', {
  writable: true,
  configurable: true,
  value: (((timer: ReturnType<typeof setTimeout>) => {
    activeTimeouts.delete(timer)
    originalClearTimeout(timer)
  }) as unknown) as typeof clearTimeout,
})

afterEach(() => {
  activeTimeouts.forEach((timer) => {
    originalClearTimeout(timer)
  })
  activeTimeouts.clear()
  cleanup()
  window.localStorage.clear()
  delete document.documentElement.dataset.theme
  document.documentElement.style.colorScheme = 'light'
  delete document.body.dataset.theme
})
