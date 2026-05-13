# Forum Member Map

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Flarum](https://img.shields.io/badge/flarum-2.x-purple.svg)

A [Flarum](http://flarum.org) extension for **Flarum 2.0+**.

Adds a `/map` page to your forum showing an interactive world map with pins for every member who has set their location. Members can place or move their own pin directly on the map, add a title and short bio, and visitors can click any pin to see a profile card with a link to their forum profile.

## Features

- 🗺️ Dedicated `/map` forum page with a full-width Leaflet map
- 📍 Avatar-circle pins for each member (falls back to initial letter)
- 💬 Popup bio card showing: avatar, display name, title, bio, join date, profile link
- ✏️ Logged-in users click anywhere on the map to drop / move their pin and fill in their info
- 🎨 Admin can choose between **OpenStreetMap** (free) or **Mapbox** (API key required) tiles

## Requirements

- Flarum `^2.0.0`
- PHP `^8.1`
- Node 18+ / npm (to build JS from source)

## Installation

```sh
composer require wyatts97/forum-member-map:"*"
php flarum migrate
php flarum cache:clear
```

## Building JS from Source

```sh
cd js
npm install
npm run build
```

## Updating

```sh
composer update wyatts97/forum-member-map:"*"
php flarum migrate
php flarum cache:clear
```

## Admin Settings

In the Flarum admin panel → Extensions → Forum Member Map:

| Setting | Description |
|---|---|
| **Map Tile Provider** | `openstreetmap` (default, free) or `mapbox` |
| **Mapbox Public Token** | Required only when Mapbox is selected |

## Database

Adds four nullable columns to the `users` table:

| Column | Type | Description |
|---|---|---|
| `map_lat` | string(32) | Latitude |
| `map_lng` | string(32) | Longitude |
| `map_title` | string(100) | User's short title shown on popup |
| `map_bio` | text | User's bio shown on popup |

## Credits

Built on top of [`justoverclock/users-map-location`](https://github.com/justoverclockl/users-map-location) (Leaflet integration).
Uses [Leaflet.js](https://leafletjs.com/) and [OpenStreetMap](https://www.openstreetmap.org/).

