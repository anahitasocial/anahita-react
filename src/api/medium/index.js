import privacy from './privacy';

export default (namespace) => {
  return {
    privacy: privacy(namespace),
  };
};
