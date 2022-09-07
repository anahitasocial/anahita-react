/* eslint-disable jsx-a11y/anchor-is-valid, no-alert */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import striptags from 'striptags';
import EntityBody from './EntityBody';
import i18n from '../languages';

const CHAR_LIMIT = 280;

const ReadMore = (props) => {
  const {
    charLimit,
    readMoreText,
    children,
    contentFilter,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const shortBody = `${striptags(children.substr(0, charLimit))}... `;
  const longBody = `${children} `;

  if (striptags(children).length < charLimit) {
    return (
      <EntityBody contentFilter={contentFilter}>
        {longBody}
      </EntityBody>
    );
  }

  return (
    <>
      <Collapse
        in={!isOpen}
        timeout="auto"
        unmountOnExit
      >
        <EntityBody contentFilter={contentFilter}>
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
        <EntityBody contentFilter={contentFilter}>
          {longBody}
        </EntityBody>
      </Collapse>
    </>
  );
};

ReadMore.propTypes = {
  charLimit: PropTypes.number,
  readMoreText: PropTypes.string,
  children: PropTypes.string.isRequired,
  contentFilter: PropTypes.bool,
};

ReadMore.defaultProps = {
  charLimit: CHAR_LIMIT,
  readMoreText: i18n.t('commons:readMore'),
  contentFilter: false,
};

export default ReadMore;
