import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

export default class UserPinPopup extends Component {
  view() {
    const { user } = this.attrs;

    const displayName = user.displayName();
    const avatarUrl = user.avatarUrl();
    const mapTitle = user.attribute('mapTitle');
    const mapBio = user.attribute('mapBio');
    const joinTime = user.joinTime();
    const profileUrl = app.route('user', { username: user.slug() });

    const joinLabel = joinTime
      ? new Date(joinTime).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      : null;

    return (
      <div className="MemberMapPopup">
        <div className="MemberMapPopup-header">
          <div className="MemberMapPopup-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} />
            ) : (
              <span className="MemberMapPopup-avatarPlaceholder">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="MemberMapPopup-identity">
            <strong className="MemberMapPopup-name">{displayName}</strong>
            {mapTitle && <span className="MemberMapPopup-title">{mapTitle}</span>}
          </div>
        </div>

        {mapBio && <p className="MemberMapPopup-bio">{mapBio}</p>}

        <div className="MemberMapPopup-footer">
          {joinLabel && (
            <span className="MemberMapPopup-joined">
              {app.translator.trans('wyatts97-forum-member-map.forum.popup_joined', { date: joinLabel })}
            </span>
          )}
          <a href={profileUrl} className="Button Button--primary Button--sm MemberMapPopup-profileLink">
            {app.translator.trans('wyatts97-forum-member-map.forum.popup_view_profile')}
          </a>
        </div>
      </div>
    );
  }
}
