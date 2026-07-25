import { escapeRegExp } from 'lodash'
import type {
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
} from 'mongoose'
import type { PaginatedResult, Pagination } from './pagination'
import { toPaginatedResult } from './pagination'
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

async function paginateFind<T, P = object>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  pagination?: Pagination,
  sort?: Record<string, 1 | -1 | 'asc' | 'desc'>,
  populate?: PopulateOptions | (PopulateOptions | string)[]
): Promise<PaginatedResult<T & P>> {
  const buildQuery = () => {
    let q = model.find(filter)
    if (sort) {
      q = q.sort(sort)
    }
    if (populate) {
      q = q.populate(populate as Parameters<typeof q.populate>[0])
    }
    return q
  }

  if (!pagination) {
    const items = (await buildQuery().lean()) as (T & P)[]
    return {
      currentPage: 1,
      items,
      size: items.length,
      total: items.length,
      totalPages: 1,
    }
  }

  const [items, total] = await Promise.all([
    buildQuery()
      .skip(pagination.size * (pagination.page - 1))
      .limit(pagination.size)
      .lean() as Promise<(T & P)[]>,
    model.countDocuments(filter),
  ])

  return toPaginatedResult(items, total, pagination)
}

async function paginateAggregate<T>(
  model: Model<T>,
  pipeline: PipelineStage[] = [],
  pagination?: Pagination
): Promise<PaginatedResult<T>> {
  if (!pagination) {
    const items = await model.aggregate(pipeline)
    return {
      currentPage: 1,
      items,
      size: items.length,
      total: items.length,
      totalPages: 1,
    }
  }

  const [countResult] = await model
    .aggregate([...pipeline, { $count: 'count' }])
    .exec()

  const total = countResult?.count ?? 0

  const items = await model
    .aggregate(pipeline)
    .skip(pagination.size * (pagination.page - 1))
    .limit(pagination.size)
    .exec()

  return toPaginatedResult(items, total, pagination)
}

export const MongooseUtils = {
  buildSearchPipeline,
  paginateAggregate,
  paginateFind,
}
