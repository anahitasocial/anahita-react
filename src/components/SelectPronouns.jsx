import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import i18n from '../languages';

// The options come from the language file, not from a constant.
//
// That is the whole reason this can be a select at all. A fixed list hard-codes
// English grammar: "he/him, she/her, they/them" is meaningless in Persian,
// Turkish or Finnish, which have no gendered third-person pronoun, and wrong in
// French, where the set is il/elle/iel. Each locale ships the set that makes
// sense in its own language, and a locale with nothing to offer ships none.
//
// The value stored is whatever string was chosen. There is no enum on the
// server and no validation against a list — the column is free text, so adding
// an option to a language file is a translation change and nothing else.
const SelectPronouns = ({
  value = '',
  ...props
}) => {
  const options = i18n.t('people:person.pronounOptions', { returnObjects: true });
  const list = Array.isArray(options) ? options : [];

  return (
    <Select {...props} value={value} displayEmpty>
      {/* Unset is a real answer and the default one. Most people will leave it
          alone, and an empty pronouns field renders nothing beside their name. */}
      <MenuItem value="">
        {i18n.t('people:person.pronounsUnset')}
      </MenuItem>
      {list.map((option) => {
        return (
          <MenuItem key={`pronouns_${option}`} value={option}>
            {option}
          </MenuItem>
        );
      })}
    </Select>
  );
};

SelectPronouns.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SelectPronouns;
