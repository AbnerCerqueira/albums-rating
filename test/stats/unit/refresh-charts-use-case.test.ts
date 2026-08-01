import { describe, expect, test, vi } from 'vitest'
import { RefreshChartsUseCase } from '@/contexts/stats/application/refresh-charts-use-case'

describe('RefreshChartsUseCase', () => {
  test('calls refreshAll on repository', async () => {
    const albumChartsRepository = {
      findMostReviewed: vi.fn(),
      findReviewCountsByPublicIds: vi.fn(),
      findTopRated: vi.fn(),
      refreshAll: vi.fn(),
    }

    const useCase = new RefreshChartsUseCase(albumChartsRepository)

    await useCase.execute()

    expect(albumChartsRepository.refreshAll).toHaveBeenCalledOnce()
  })
})
