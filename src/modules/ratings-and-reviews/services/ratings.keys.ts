import type { RateeType, RatingFilters } from "../type/ratings";

export const ratingKeys = {
  all:        ()                            => ["ratings"] as const,
  list:       (f?: RatingFilters)           => ["ratings", "list", f] as const,
  detail:     (id: string)                  => ["ratings", "detail", id] as const,
  stats:      (type: RateeType, id: string) => ["ratings", "stats", type, id] as const,
  alerts:     (p?: object)                  => ["ratings", "alerts", p] as const,
  thresholds: ()                            => ["ratings", "thresholds"] as const,
};
