import { useContext } from 'react'

import { ComparisonContext } from '@/features/comparison/model/ComparisonContext'

export function useComparison() {
  const context = useContext(ComparisonContext)

  if (!context) {
    throw new Error('useComparison must be used inside ComparisonProvider')
  }

  return context
}
