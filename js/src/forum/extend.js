import Extend from 'flarum/common/extenders';
import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import MemberMapPage from './components/MemberMapPage';
import LinkButton from 'flarum/common/components/LinkButton';
import IndexPage from 'flarum/forum/components/IndexPage';

extend(IndexPage.prototype, 'navItems', function (items) {
  if (app.forum.attribute('forum-member-map.showNavLink')) {
    items.add(
      'forum-member-map',
      <LinkButton href={app.route('forum-member-map')} icon="fas fa-map-marked-alt">
        {app.translator.trans('wyatts97-forum-member-map.forum.nav_link')}
      </LinkButton>,
      -10
    );
  }
});

export default [
  new Extend.Routes().add('forum-member-map', '/map', MemberMapPage),
];
