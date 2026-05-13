import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import L from 'leaflet';
import 'leaflet.markercluster';
import EditLocationModal from './EditLocationModal';
import UserPinPopup from './UserPinPopup';

export default class MemberMapPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = true;
    this.users = [];
    this.map = null;
    this.clusterGroup = null;
    this.markerMap = {};
    this.placingPin = false;
    this.canView = !!(app.session.user && app.session.user.attribute('canViewMap'));

    app.setTitle(app.translator.trans('wyatts97-forum-member-map.forum.page_title'));

    if (!this.canView) {
      this.loading = false;
      return;
    }

    app.store
      .find('users', {
        filter: { hasLocation: '1' },
        page: { limit: 500 },
      })
      .then((users) => {
        this.users = users;
        this.loading = false;
        if (this.map) {
          this.syncAllMarkers();
        }
        m.redraw();
      })
      .catch(() => {
        this.loading = false;
        m.redraw();
      });
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    if (!this.canView) return;
    this.initMap();
  }

  onremove(vnode) {
    super.onremove(vnode);
    if (this.clusterGroup) {
      this.clusterGroup.clearLayers();
      this.clusterGroup = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markerMap = {};
    }
  }

  initMap() {
    const tileProvider = app.forum.attribute('forum-member-map.tileProvider') || 'openstreetmap';
    const mapboxToken = app.forum.attribute('forum-member-map.mapboxToken') || '';

    this.map = L.map('member-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
    });

    if (tileProvider === 'mapbox' && mapboxToken) {
      L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
        id: 'mapbox/streets-v12',
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ' +
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      }).addTo(this.map);
    }

    this.clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 14,
    });
    this.map.addLayer(this.clusterGroup);

    this.map.on('click', (e) => {
      if (this.placingPin && app.session.user) {
        this.openEditModal(e.latlng.lat, e.latlng.lng);
      }
    });

    if (this.users.length > 0) {
      this.syncAllMarkers();
    }
  }

  syncAllMarkers() {
    this.users.forEach((user) => {
      const lat = parseFloat(user.attribute('mapLat'));
      const lng = parseFloat(user.attribute('mapLng'));
      if (!isNaN(lat) && !isNaN(lng)) {
        this.upsertMarker(user, lat, lng);
      }
    });
  }

  buildIcon(user) {
    const avatarUrl = user.avatarUrl();
    const displayName = user.displayName() || '?';
    const initial = displayName.charAt(0).toUpperCase();
    const isSelf = app.session.user && String(app.session.user.id()) === String(user.id());
    const selfClass = isSelf ? ' member-map-pin--self' : '';

    const inner = avatarUrl
      ? `<img class="member-map-pin__img" src="${avatarUrl}" alt="" />`
      : `<span class="member-map-pin__initial">${initial}</span>`;

    return L.divIcon({
      className: `member-map-pin${selfClass}`,
      html: `<div class="member-map-pin__inner">${inner}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -44],
    });
  }

  buildPopupElement(user) {
    const el = document.createElement('div');
    m.render(el, m(UserPinPopup, { user }));
    return el;
  }

  upsertMarker(user, lat, lng) {
    const userId = String(user.id());

    if (this.markerMap[userId]) {
      this.clusterGroup.removeLayer(this.markerMap[userId]);
      delete this.markerMap[userId];
    }

    const marker = L.marker([lat, lng], { icon: this.buildIcon(user) }).bindPopup(
      this.buildPopupElement(user),
      { maxWidth: 280, minWidth: 220, className: 'member-map-popup-wrap' }
    );

    this.clusterGroup.addLayer(marker);
    this.markerMap[userId] = marker;
  }

  openEditModal(lat, lng) {
    const currentUser = app.session.user;
    app.modal.show(EditLocationModal, {
      lat,
      lng,
      currentTitle: currentUser.attribute('mapTitle') || '',
      currentBio: currentUser.attribute('mapBio') || '',
      onSave: (savedLat, savedLng) => {
        this.placingPin = false;
        const mapEl = this.map && this.map.getContainer();
        if (mapEl) mapEl.classList.remove('member-map--placing');
        this.upsertMarker(currentUser, savedLat, savedLng);
        m.redraw();
      },
    });
  }

  togglePlacingPin() {
    this.placingPin = !this.placingPin;
    if (this.map) {
      this.map.getContainer().classList.toggle('member-map--placing', this.placingPin);
    }
    m.redraw();
  }

  removePin() {
    const user = app.session.user;
    const userId = String(user.id());

    user
      .save({ mapLat: null, mapLng: null, mapTitle: null, mapBio: null })
      .then(() => {
        if (this.clusterGroup && this.markerMap[userId]) {
          this.clusterGroup.removeLayer(this.markerMap[userId]);
          delete this.markerMap[userId];
        }
        m.redraw();
      });
  }

  view() {
    const loggedIn = !!app.session.user;

    if (!this.canView) {
      return (
        <div className="MemberMapPage">
          <div className="MemberMapPage-header container">
            <h2 className="MemberMapPage-title">
              {app.translator.trans('wyatts97-forum-member-map.forum.page_title')}
            </h2>
            <p className="MemberMapPage-loginHint helpText">
              {loggedIn
                ? app.translator.trans('wyatts97-forum-member-map.forum.no_view_permission_hint')
                : app.translator.trans('wyatts97-forum-member-map.forum.login_hint')}
            </p>
          </div>
        </div>
      );
    }

    const canAddPin = loggedIn && app.session.user.attribute('canAddMapPin');
    const userHasPin =
      loggedIn &&
      app.session.user.attribute('mapLat') &&
      app.session.user.attribute('mapLng');

    return (
      <div className="MemberMapPage">
        <div className="MemberMapPage-header container">
          <h2 className="MemberMapPage-title">
            {app.translator.trans('wyatts97-forum-member-map.forum.page_title')}
          </h2>
          <p className="MemberMapPage-subtitle helpText">
            {app.translator.trans('wyatts97-forum-member-map.forum.page_subtitle')}
          </p>

          <div className="MemberMapPage-toolbar">
            {canAddPin && (
              <Button
                className={`Button ${this.placingPin ? 'Button--danger' : 'Button--primary'}`}
                icon={this.placingPin ? 'fas fa-times' : 'fas fa-map-marker-alt'}
                onclick={this.togglePlacingPin.bind(this)}
              >
                {this.placingPin
                  ? app.translator.trans('wyatts97-forum-member-map.forum.cancel_placement')
                  : userHasPin
                  ? app.translator.trans('wyatts97-forum-member-map.forum.move_pin')
                  : app.translator.trans('wyatts97-forum-member-map.forum.set_location')}
              </Button>
            )}

            {canAddPin && userHasPin && !this.placingPin && (
              <Button
                className="Button Button--danger"
                icon="fas fa-trash-alt"
                onclick={this.removePin.bind(this)}
              >
                {app.translator.trans('wyatts97-forum-member-map.forum.remove_pin')}
              </Button>
            )}

            {this.placingPin && (
              <span className="MemberMapPage-hint">
                {app.translator.trans('wyatts97-forum-member-map.forum.click_to_place')}
              </span>
            )}

            {!loggedIn && (
              <span className="MemberMapPage-loginHint helpText">
                {app.translator.trans('wyatts97-forum-member-map.forum.login_hint')}
              </span>
            )}

            {loggedIn && !canAddPin && (
              <span className="MemberMapPage-loginHint helpText">
                {app.translator.trans('wyatts97-forum-member-map.forum.no_permission_hint')}
              </span>
            )}
          </div>
        </div>

        <div className="MemberMapPage-mapWrap">
          {this.loading && (
            <div className="MemberMapPage-loading">
              <LoadingIndicator size="large" />
            </div>
          )}
          <div id="member-map" />
        </div>
      </div>
    );
  }
}
