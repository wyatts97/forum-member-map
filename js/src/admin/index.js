import app from 'flarum/admin/app';

export { default as extend } from './extend';

app.initializers.add('wyatts97/forum-member-map', () => {
  app.extensionData
    .for('wyatts97-forum-member-map')
    .registerSetting({
      setting: 'forum-member-map.tileProvider',
      type: 'select',
      options: {
        openstreetmap: app.translator.trans('wyatts97-forum-member-map.admin.tile_provider_osm'),
        mapbox: app.translator.trans('wyatts97-forum-member-map.admin.tile_provider_mapbox'),
      },
      default: 'openstreetmap',
      label: app.translator.trans('wyatts97-forum-member-map.admin.tile_provider_label'),
    })
    .registerSetting({
      setting: 'forum-member-map.mapboxToken',
      type: 'text',
      label: app.translator.trans('wyatts97-forum-member-map.admin.mapbox_token_label'),
      help: app.translator.trans('wyatts97-forum-member-map.admin.mapbox_token_help'),
    });
});
