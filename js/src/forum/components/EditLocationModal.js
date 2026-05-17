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
    this.mapBio = Stream(this.attrs.currentBio || '');
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
            <label>{app.translator.trans('wyatts97-forum-member-map.forum.modal_bio_label')}</label>
            <textarea
              className="FormControl"
              rows={4}
              maxLength={500}
              placeholder={app.translator.trans('wyatts97-forum-member-map.forum.modal_bio_placeholder')}
              bidi={this.mapBio}
            />
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
        mapBio: this.mapBio(),
      })
      .then(() => {
        if (this.attrs.onSave) {
          this.attrs.onSave(
            parseFloat(this.lat),
            parseFloat(this.lng)
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
