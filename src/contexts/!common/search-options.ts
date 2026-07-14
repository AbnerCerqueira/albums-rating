export const MATCH_TYPES = ['perfect', 'startsWith'] as const
export const COMBINE_WITH = ['and', 'or'] as const

export type MatchType = (typeof MATCH_TYPES)[number]
export type CombineWith = (typeof COMBINE_WITH)[number]

export type SearchOptions = {
  matchType: MatchType
  combineWith: CombineWith
}

export const defaultSearchOptions: SearchOptions = {
  combineWith: 'and',
  matchType: 'perfect',
}
