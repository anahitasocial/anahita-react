import apps from './apps';
import permissions from './permissions';
import privacy from './privacy';

export default (namespace) => {
  return {
    apps: apps(namespace),
    permissions: permissions(namespace),
    privacy: privacy(namespace),
  };
};
