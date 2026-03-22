import { useEffect, useEffectEvent, useRef } from 'react'

type UseInfiniteScrollTriggerParams = {
  canLoadMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

export function useInfiniteScrollTrigger({
  canLoadMore,
  isLoading,
  onLoadMore,
}: UseInfiniteScrollTriggerParams) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const handleIntersection = useEffectEvent(
    (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0]

      if (!firstEntry?.isIntersecting || !canLoadMore || isLoading) {
        return
      }

      onLoadMore()
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
        rootMargin: '320px 0px',
      },
    )

    observer.observe(targetElement)

    return () => {
      observer.disconnect()
    }
  }, [canLoadMore])

  return targetRef
}
