<?php

/*
 * This file is part of wyatts97/forum-member-map.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Extend;
use Flarum\Search\Database\DatabaseSearchDriver;
use Flarum\User\Event\Saving;
use Flarum\User\Search\UserSearcher;
use Flarum\User\User;
use Wyatts97\ForumMemberMap\Filter\HasMapLocationFilter;
use Wyatts97\ForumMemberMap\Listeners\ValidateMapLocation;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less')
        ->route('/map', 'forum-member-map'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\ApiResource(Resource\UserResource::class))
        ->fields(fn () => [
            Schema\Str::make('mapLat')
                ->nullable()
                ->get(fn (User $user) => $user->map_lat)
                ->set(fn (User $user, ?string $value) => $user->map_lat = $value)
                ->writable(fn ($model, $context) =>
                    ($context->getActor()->id === $model->id && $context->getActor()->can('forum-member-map.addPin'))
                    || $context->getActor()->can('edit', $model)),
                
            Schema\Str::make('mapLng')
                ->nullable()
                ->get(fn (User $user) => $user->map_lng)
                ->set(fn (User $user, ?string $value) => $user->map_lng = $value)
                ->writable(fn ($model, $context) =>
                    ($context->getActor()->id === $model->id && $context->getActor()->can('forum-member-map.addPin'))
                    || $context->getActor()->can('edit', $model)),
                
            Schema\Str::make('mapTitle')
                ->nullable()
                ->get(fn (User $user) => $user->map_title)
                ->set(fn (User $user, ?string $value) => $user->map_title = $value)
                ->writable(fn ($model, $context) =>
                    ($context->getActor()->id === $model->id && $context->getActor()->can('forum-member-map.addPin'))
                    || $context->getActor()->can('edit', $model)),
                
            Schema\Str::make('mapBio')
                ->nullable()
                ->get(fn (User $user) => $user->map_bio)
                ->set(fn (User $user, ?string $value) => $user->map_bio = $value)
                ->writable(fn ($model, $context) =>
                    ($context->getActor()->id === $model->id && $context->getActor()->can('forum-member-map.addPin'))
                    || $context->getActor()->can('edit', $model)),

            Schema\Str::make('mapLocationLabel')
                ->nullable()
                ->get(fn (User $user) => $user->map_location_label)
                ->set(fn (User $user, ?string $value) => $user->map_location_label = $value)
                ->writable(fn ($model, $context) =>
                    ($context->getActor()->id === $model->id && $context->getActor()->can('forum-member-map.addPin'))
                    || $context->getActor()->can('edit', $model)),

            Schema\Boolean::make('mapVisible')
                ->get(fn (User $user) => $user->map_visible ?? true)
                ->set(fn (User $user, bool $value) => $user->map_visible = $value)
                ->writable(fn ($model, $context) =>
                    ($context->getActor()->id === $model->id && $context->getActor()->can('forum-member-map.addPin'))
                    || $context->getActor()->can('edit', $model)),
                
            Schema\Boolean::make('canAddMapPin')
                ->get(fn (User $user, $context) =>
                    $user->id === $context->getActor()->id
                    && $context->getActor()->can('forum-member-map.addPin')
                ),

            Schema\Boolean::make('canViewMap')
                ->get(fn (User $user, $context) =>
                    $user->id === $context->getActor()->id
                    && $context->getActor()->can('forum-member-map.viewMap')
                ),
        ]),

    (new Extend\SearchDriver(DatabaseSearchDriver::class))
        ->addFilter(UserSearcher::class, HasMapLocationFilter::class),

    (new Extend\Event())
        ->listen(Saving::class, ValidateMapLocation::class),

    (new Extend\Settings())
        ->serializeToForum('forum-member-map.tileProvider', 'forum-member-map.tileProvider', null, 'openstreetmap')
        ->serializeToForum('forum-member-map.mapboxToken', 'forum-member-map.mapboxToken')
        ->serializeToForum('forum-member-map.showNavLink', 'forum-member-map.showNavLink', 'boolval', false),
];
