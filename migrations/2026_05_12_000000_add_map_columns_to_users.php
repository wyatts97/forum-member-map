<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'map_lat'   => ['type' => 'string', 'length' => 32,  'nullable' => true, 'default' => null],
    'map_lng'   => ['type' => 'string', 'length' => 32,  'nullable' => true, 'default' => null],
    'map_title' => ['type' => 'string', 'length' => 100, 'nullable' => true, 'default' => null],
    'map_bio'   => ['type' => 'text',                    'nullable' => true, 'default' => null],
]);
