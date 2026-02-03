import { escapeRegExp } from 'lodash'
import type { Aggregate, PipelineStage, Query } from 'mongoose'
import type { Pagination } from './pagination'
import { defaultSearchStringOptions, type SearchStringOptions } from './search-options'

function buildSearchStringPipeline(
  fields: Record<string, string>,
  options: SearchStringOptions = defaultSearchStringOptions
): PipelineStage[] {
  const validEntries = Object.entries(fields).filter(([, value]) =>
    value?.trim()
  )

  if (!validEntries.length) {
    return []
  }

  const { matchType, combineWith } = options

  const matchStage: PipelineStage.Match = {
    $match: {},
  }

  const buildValueByMatchType = (value: string) =>
    matchType === 'perfect'
      ? value
      : { $regex: `^${escapeRegExp(value)}`, $options: 'i' }

  if (combineWith === 'or') {
    matchStage.$match = { $or: [] }

    for (const [key, value] of validEntries) {
      matchStage.$match.$or?.push({ [key]: buildValueByMatchType(value) })
    }

    return [matchStage]
  }

  for (const [key, value] of validEntries) {
    matchStage.$match[key] = buildValueByMatchType(value)
  }

  return [matchStage]
}

function withPagination(
  // biome-ignore lint/suspicious/noExplicitAny: necessário
  aggregate: Aggregate<any> | Query<any, any>,
  pagination?: Pagination
): void {
  if (!pagination) {
    return
  }
  const { page, size } = pagination
  aggregate.skip(size * (page - 1)).limit(size)
}

export const MongooseUtils = {
  withPagination,
  buildSearchStringPipeline,
}
