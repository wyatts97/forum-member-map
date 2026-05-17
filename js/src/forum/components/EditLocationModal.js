import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Stream from 'flarum/common/utils/Stream';

export default class EditLocationModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.lat = this.attrs.lat;
    this.lng = this.attrs.lng;
    this.mapTitle = Stream(this.attrs.currentTitle || '');
    this.mapLocationLabel = Stream(this.attrs.currentLocationLabel || '');
    this.mapBio = Stream(this.attrs.currentBio || '');
    this.mapVisible = Stream(this.attrs.currentVisible !== false);
    this.saving = false;
    this.error = null;
  }

  className() {
    return 'EditLocationModal Modal--small';
  }

  title() {
    return app.translator.trans('wyatts97-forum-member-map.forum.modal_title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>{app.translator.trans('wyatts97-forum-member-map.forum.modal_coords_label')}</label>
            <p className="EditLocationModal-coords helpText">
              {parseFloat(this.lat).toFixed(4)}°, {parseFloat(this.lng).toFixed(4)}°
            </p>
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('wyatts97-forum-member-map.forum.modal_title_label')}</label>
            <input
              className="FormControl"
              type="text"
              maxLength={100}
              placeholder={app.translator.trans('wyatts97-forum-member-map.forum.modal_title_placeholder')}
              bidi={this.mapTitle}
            />
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('wyatts97-forum-member-map.forum.modal_location_label')}</label>
            <input
              className="FormControl"
              type="text"
              maxLength={120}
              placeholder={app.translator.trans('wyatts97-forum-member-map.forum.modal_location_placeholder')}
              bidi={this.mapLocationLabel}
            />
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('wyatts97-forum-member-map.forum.modal_bio_label')}</label>
            <textarea
              className="FormControl"
              rows={4}
              maxLength={500}
              placeholder={app.translator.trans('wyatts97-forum-member-map.forum.modal_bio_placeholder')}
              bidi={this.mapBio}
            />
          </div>

          <div className="Form-group">
            <label className="EditLocationModal-toggle">
              <input
                type="checkbox"
                checked={this.mapVisible()}
                onchange={(e) => this.mapVisible(e.target.checked)}
              />
              <span>
                {app.translator.trans('wyatts97-forum-member-map.forum.modal_visible_label')}
              </span>
            </label>
            <p className="helpText EditLocationModal-help">
              {app.translator.trans('wyatts97-forum-member-map.forum.modal_visible_help')}
            </p>
          </div>

          {this.error && (
            <div className="Form-group">
              <p className="EditLocationModal-error helpText" style="color: var(--color-danger)">
                {this.error}
              </p>
            </div>
          )}

          <div className="Form-group">
            <Button
              className="Button Button--primary"
              type="submit"
              loading={this.saving}
              onclick={this.onsubmit.bind(this)}
              disabled={this.saving}
            >
              {app.translator.trans('wyatts97-forum-member-map.forum.modal_save')}
            </Button>
            <Button
              className="Button"
              onclick={() => app.modal.close()}
              disabled={this.saving}
            >
              {app.translator.trans('wyatts97-forum-member-map.forum.modal_cancel')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e && e.preventDefault();

    this.saving = true;
    this.error = null;
    m.redraw();

    const user = app.session.user;

    user
      .save({
        mapLat: String(parseFloat(this.lat).toFixed(5)),
        mapLng: String(parseFloat(this.lng).toFixed(5)),
        mapTitle: this.mapTitle(),
        mapLocationLabel: this.mapLocationLabel(),
        mapBio: this.mapBio(),
        mapVisible: this.mapVisible(),
      })
      .then(() => {
        if (this.attrs.onSave) {
          this.attrs.onSave(
            parseFloat(this.lat),
            parseFloat(this.lng),
            this.mapVisible()
          );
        }
        app.modal.close();
      })
      .catch((err) => {
        this.saving = false;
        this.error =
          (err.response && err.response.errors && err.response.errors[0] && err.response.errors[0].detail) ||
          app.translator.trans('wyatts97-forum-member-map.forum.modal_save_error');
        m.redraw();
      });
  }
}
