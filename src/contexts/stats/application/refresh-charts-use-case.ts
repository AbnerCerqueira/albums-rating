import type { AlbumChartsRepository } from '../domain/album-charts-repository'

export class RefreshChartsUseCase {
  constructor(private readonly albumChartsRepository: AlbumChartsRepository) {}

  async execute(): Promise<void> {
    await this.albumChartsRepository.refreshAll()
  }
}
