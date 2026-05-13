import Extend from 'flarum/common/extenders';
import MemberMapPage from './components/MemberMapPage';

export default [
  new Extend.Routes().add('forum-member-map', '/map', <MemberMapPage />),
];
