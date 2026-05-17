<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'map_location_label' => ['type' => 'string', 'length' => 120, 'nullable' => true, 'default' => null],
    'map_visible'        => ['type' => 'boolean',                'nullable' => false, 'default' => true],
]);
