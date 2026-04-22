// should catch any API errors and act accordingly
// eslint-disable-next-line import/prefer-default-export, arrow-body-style
export const apiErrorMiddleware = () => (next) => (action) => {
  const result = next(action);

  if (result.payload && result.payload.error) {
    const { error } = result.payload;

    switch (error.status) {
      case 400:
        break;

      case 403:
        break;

      case 404:
        break;

      default:
        break;
    }
  }
  return result;
};
