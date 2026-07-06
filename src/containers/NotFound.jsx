import React from 'react';
import Typography from '@material-ui/core/Typography';
import i18n from '../languages';

const NotFoundPage = () => {
  return (
    <Typography variant="h4">
      {i18n.t('commons:errors.404')}
    </Typography>
  );
};

export default NotFoundPage;
