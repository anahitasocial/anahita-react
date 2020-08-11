import apps from './apps';
import permissions from './permissions';

export default (namespace) => {
  return {
    apps: apps(namespace),
    permissions: permissions(namespace),
  };
};
