import { env } from '@/infra/config/envs'

const MAX_LENGTH = 2048
const URL_PATTERN = /^(?:\/|https?:\/\/)\S+$/

function isValidCoverUrl(value: string): boolean {
  if (value.length > MAX_LENGTH) {
    return false
  }

  return URL_PATTERN.test(value)
}

export class CoverUrl {
  private constructor(readonly value: string) {}

  static create(url?: string): CoverUrl {
    const candidate = url?.trim()
    if (candidate && isValidCoverUrl(candidate)) {
      return new CoverUrl(candidate)
    }

    return new CoverUrl(env.DEFAULT_COVER_URL.trim())
  }

  isDefault(): boolean {
    return this.value === env.DEFAULT_COVER_URL.trim()
  }

  static unsafe(url: string) {
    return new CoverUrl(url)
  }

  equals(other: CoverUrl) {
    return this.value === other.value
  }
}
