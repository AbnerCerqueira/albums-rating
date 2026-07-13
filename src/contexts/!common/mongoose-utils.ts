import { escapeRegExp } from 'lodash'
import type { Aggregate, PipelineStage, Query } from 'mongoose'
import type { Pagination } from './pagination'
import { defaultSearchOptions, type SearchOptions } from './search-options'

function buildSearchPipeline(
  fields: Record<string, string | string[]>,
  options: SearchOptions = defaultSearchOptions
): PipelineStage[] {
  const validEntries = Object.entries(fields).flatMap(([key, value]) => {
    const values = Array.isArray(value) ? value : [value]
    return values
      .filter((v): v is string => typeof v === 'string' && Boolean(v?.trim()))
      .map((v) => [key, v.trim()] as [string, string])
  })

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
      : { $options: 'i', $regex: `^${escapeRegExp(value)}` }

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
  buildSearchPipeline,
  withPagination,
}
