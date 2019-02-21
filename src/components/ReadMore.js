/* eslint-disable jsx-a11y/anchor-is-valid, no-alert */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Collapse from '@material-ui/core/Collapse';
import striptags from 'striptags';
import EntityBody from './EntityBody';
import i18n from '../languages';

const CHAR_LIMIT = 150;

class ReadMore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;
    const {
      charLimit,
      readMoreText,
      children,
    } = this.props;

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
            onClick={this.toggleCollapse}
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
  }
}

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
