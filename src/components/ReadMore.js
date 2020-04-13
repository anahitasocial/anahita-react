/* eslint-disable jsx-a11y/anchor-is-valid, no-alert */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import striptags from 'striptags';
import EntityBody from './EntityBody';
import i18n from '../languages';

const CHAR_LIMIT = 150;

const ReadMore = (props) => {
  const {
    charLimit,
    readMoreText,
    children,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  if (striptags(children).length < charLimit) {
    return (
      <EntityBody>
        {children}
      </EntityBody>
    );
  }

  const shortBody = `${striptags(children.substr(0, charLimit))}... `;
  const longBody = `${children} `;

  return (
    <React.Fragment>
      <Collapse
        in={!isOpen}
        timeout="auto"
        unmountOnExit
      >
        <EntityBody>
          {shortBody}
        </EntityBody>
        <Link
          component="button"
          onClick={toggleCollapse}
          variant="body2"
        >
          {readMoreText}
        </Link>
      </Collapse>
      <Collapse
        in={isOpen}
        timeout="auto"
        unmountOnExit
      >
        <EntityBody>
          {longBody}
        </EntityBody>
      </Collapse>
    </React.Fragment>
  );
};

ReadMore.propTypes = {
  charLimit: PropTypes.number,
  readMoreText: PropTypes.string,
  children: PropTypes.string.isRequired,
};

ReadMore.defaultProps = {
  charLimit: CHAR_LIMIT,
  readMoreText: i18n.t('commons:readMore'),
};

export default ReadMore;
