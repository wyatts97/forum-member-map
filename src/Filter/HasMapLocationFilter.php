<?php

namespace Wyatts97\ForumMemberMap\Filter;

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\User\User;

class HasMapLocationFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'hasLocation';
    }

    public function filter(DatabaseSearchState $state, string|array $value, bool $negate): void
    {
        $truthy = filter_var($value, FILTER_VALIDATE_BOOLEAN);

        if ($truthy && !$negate) {
            $state->getQuery()
                ->whereNotNull('map_lat')
                ->whereNotNull('map_lng');
        } elseif (!$truthy || $negate) {
            $state->getQuery()
                ->whereNull('map_lat');
        }
    }
}
