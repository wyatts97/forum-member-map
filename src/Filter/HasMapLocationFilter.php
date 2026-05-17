<?php

namespace Wyatts97\ForumMemberMap\Filter;

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class HasMapLocationFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'hasLocation';
    }

    public function filter(SearchState $state, $filterValue, bool $negate): void
    {
        if (is_array($filterValue)) {
            $filterValue = reset($filterValue);
        }

        $truthy = filter_var($filterValue, FILTER_VALIDATE_BOOLEAN);

        if ($truthy && ! $negate) {
            $state->getQuery()
                ->whereNotNull('map_lat')
                ->whereNotNull('map_lng');
        } elseif (! $truthy || $negate) {
            $state->getQuery()
                ->where(function ($query) {
                    $query->whereNull('map_lat')
                          ->orWhereNull('map_lng');
                });
        }
    }
}
