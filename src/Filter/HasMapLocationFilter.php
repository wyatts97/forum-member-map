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

    public function filter(SearchState $state, string $filterValue, bool $negate): void
    {
        $truthy = filter_var($filterValue, FILTER_VALIDATE_BOOLEAN);
        $wantWithLocation = $truthy XOR $negate;

        if ($wantWithLocation) {
            $state->getQuery()
                ->whereNotNull('users.map_lat')
                ->whereNotNull('users.map_lng');
        } else {
            $state->getQuery()->whereNull('users.map_lat');
        }
    }
}
