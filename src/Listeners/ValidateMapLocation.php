<?php

namespace Wyatts97\ForumMemberMap\Listeners;

use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class ValidateMapLocation
{
    public function handle(Saving $event): void
    {
        $attributes = Arr::get($event->data, 'attributes', []);

        if (array_key_exists('mapLat', $attributes)) {
            $lat = $attributes['mapLat'];
            if ($lat !== null) {
                if (!is_numeric($lat) || (float) $lat < -90 || (float) $lat > 90) {
                    throw ValidationException::withMessages([
                        'mapLat' => 'wyatts97-forum-member-map.forum.validation_lat',
                    ]);
                }
            }
        }

        if (array_key_exists('mapLng', $attributes)) {
            $lng = $attributes['mapLng'];
            if ($lng !== null) {
                if (!is_numeric($lng) || (float) $lng < -180 || (float) $lng > 180) {
                    throw ValidationException::withMessages([
                        'mapLng' => 'wyatts97-forum-member-map.forum.validation_lng',
                    ]);
                }
            }
        }

        if (array_key_exists('mapTitle', $attributes)) {
            $title = $attributes['mapTitle'];
            if ($title !== null && mb_strlen($title) > 100) {
                throw ValidationException::withMessages([
                    'mapTitle' => 'wyatts97-forum-member-map.forum.validation_title',
                ]);
            }
        }

        if (array_key_exists('mapBio', $attributes)) {
            $bio = $attributes['mapBio'];
            if ($bio !== null && mb_strlen($bio) > 500) {
                throw ValidationException::withMessages([
                    'mapBio' => 'wyatts97-forum-member-map.forum.validation_bio',
                ]);
            }
        }
    }
}
