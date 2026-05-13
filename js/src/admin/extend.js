import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';

export default [
  new Extend.Admin()
    .setting(
      () => ({
        setting: 'forum-member-map.tileProvider',
        type: 'select',
        options: {
          openstreetmap: app.translator.trans('wyatts97-forum-member-map.admin.tile_provider_osm', {}, true),
          mapbox: app.translator.trans('wyatts97-forum-member-map.admin.tile_provider_mapbox', {}, true),
        },
        default: 'openstreetmap',
        label: app.translator.trans('wyatts97-forum-member-map.admin.tile_provider_label', {}, true),
      }),
      10
    )
    .setting(
      () => ({
        setting: 'forum-member-map.mapboxToken',
        type: 'text',
        label: app.translator.trans('wyatts97-forum-member-map.admin.mapbox_token_label', {}, true),
        help: app.translator.trans('wyatts97-forum-member-map.admin.mapbox_token_help', {}, true),
      }),
      20
    ),
];
