import React, { useState } from 'react';
import saveAs from 'file-saver';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import DownloadIcon from '@material-ui/icons/CloudDownload';

import api from '../../../api';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

const ActionsMediumDownload = React.forwardRef((props, ref) => {
  const {
    node,
    size,
  } = props;

  const [disabled, setDisabled] = useState(false);

  const onClick = () => {
    setDisabled(true);
    api.documents.download(node.id)
      .then((result) => {
        saveAs(result.data, node.alias);
        setDisabled(false);
      })
      .catch((err) => {
        return console.error(err);
      });
  };

  return (
    <Button
      onClick={onClick}
      aria-label="Download"
      ref={ref}
      disabled={disabled}
      startIcon={
        <DownloadIcon fontSize={size} />
      }
    >
      {i18n.t('actions:download')}
    </Button>
  );
});

ActionsMediumDownload.propTypes = {
  node: NodeType.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'inherit']),
};

ActionsMediumDownload.defaultProps = {
  size: 'medium',
};

export default ActionsMediumDownload;
