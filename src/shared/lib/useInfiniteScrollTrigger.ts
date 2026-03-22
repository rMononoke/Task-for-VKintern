import { useEffect, useEffectEvent, useRef } from 'react'

type UseInfiniteScrollTriggerParams = {
  canLoadMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  watchValue?: number
}

type ShouldLoadMoreByViewportParams = {
  canLoadMore: boolean
  isLoading: boolean
  sentinelTop: number
  viewportHeight: number
  preloadDistance: number
}

const DEFAULT_PRELOAD_DISTANCE = 320

export function shouldLoadMoreByViewport({
  canLoadMore,
  isLoading,
  sentinelTop,
  viewportHeight,
  preloadDistance,
}: ShouldLoadMoreByViewportParams) {
  if (!canLoadMore || isLoading) {
    return false
  }

  return sentinelTop <= viewportHeight + preloadDistance
}

export function useInfiniteScrollTrigger({
  canLoadMore,
  isLoading,
  onLoadMore,
  watchValue,
}: UseInfiniteScrollTriggerParams) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const checkViewportPosition = useEffectEvent(() => {
    const targetElement = targetRef.current

    if (!targetElement || typeof window === 'undefined') {
      return
    }

    if (
      !shouldLoadMoreByViewport({
        canLoadMore,
        isLoading,
        sentinelTop: targetElement.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
        preloadDistance: DEFAULT_PRELOAD_DISTANCE,
      })
    ) {
      return
    }

    onLoadMore()
  })
  const handleIntersection = useEffectEvent(
    (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0]

      if (!firstEntry?.isIntersecting) {
        return
      }

      checkViewportPosition()
    },
  )

  useEffect(() => {
    if (!canLoadMore || typeof IntersectionObserver === 'undefined') {
      return
    }

    const targetElement = targetRef.current

    if (!targetElement) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        handleIntersection(entries)
      },
      {
        rootMargin: `${DEFAULT_PRELOAD_DISTANCE}px 0px`,
      },
    )

    observer.observe(targetElement)
    checkViewportPosition()

    return () => {
      observer.disconnect()
    }
  }, [canLoadMore, isLoading, watchValue])

  useEffect(() => {
    checkViewportPosition()
  }, [canLoadMore, isLoading, watchValue])

  return targetRef
}
