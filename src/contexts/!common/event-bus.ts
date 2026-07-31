import { EventEmitter } from 'node:events'

export type EventHandler = (payload?: unknown) => Promise<void>

export const DomainEvents = {
  CHART_CACHE_MISSED: 'chart-cache.missed',
} as const

export interface EventBus {
  publish: (event: string, payload?: unknown) => Promise<void>
  subscribe: (event: string, handler: EventHandler) => void
}

export class InMemoryEventBus implements EventBus {
  private readonly emitter = new EventEmitter()

  async publish(event: string, payload?: unknown): Promise<void> {
    const handlers = this.emitter.listeners(event) as EventHandler[]
    if (handlers.length === 0) {
      return
    }
    await Promise.all(handlers.map((h) => h(payload)))
  }

  subscribe(event: string, handler: EventHandler): void {
    this.emitter.on(event, handler)
  }
}

export const eventBus = new InMemoryEventBus()
