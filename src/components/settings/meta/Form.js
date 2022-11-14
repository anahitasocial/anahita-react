import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';

import i18n from '../../../languages';

const SettingsMetaForm = (props) => {
  const {
    namespace,
    formControllers,
    meta,
    fields,
    header,
    handleOnChange,
    handleOnSubmit,
    handleClose,
    isFetching,
    enabled,
  } = props;

  return (
    <form onSubmit={handleOnSubmit}>
      <Card variant="outlined">
        {header}
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={handleOnChange}
                name="enabled"
              />
            }
            label="Enabled"
          />
          {formControllers.map((fController, index) => {
            const {
              name,
              type,
              option: options,
              value,
              // label,
              description,
              disabled: fcDisabled,
            } = fController;
            const key = `${namespace}-${type}-${name}-${index}`;
            const disabled = fcDisabled === 1;

            switch (type) {
              case 'legend':
                return (
                  <FormControl
                    id={`${key}-id`}
                    key={key}
                    component="legend"
                    margin="normal"
                    disabled={disabled}
                  >
                    <FormLabel>
                      {value}
                    </FormLabel>
                    {description !== '' && <FormHelperText>{description}</FormHelperText>}
                  </FormControl>
                );
              case 'select':
              case 'list':
              case 'radio':
                return (
                  <FormControl
                    key={key}
                    fullWidth
                    margin="normal"
                  >
                    <InputLabel id={`${key}-label-id`}>
                      {i18n.t(`settings:${namespace}.${_.camelCase(name)}`)}
                    </InputLabel>
                    <Select
                      id={`${key}-id`}
                      labelId={`${key}-label-id`}
                      name={name}
                      value={meta[name]}
                      onChange={handleOnChange}
                      label={i18n.t(`settings:${namespace}.${_.camelCase(name)}`)}
                      // label={label}
                      disabled={disabled}
                    >
                      {options.map((option, optionIndex) => {
                        const optionKey = `${key}-option-${optionIndex}`;
                        return (
                          <MenuItem
                            value={option.value}
                            key={optionKey}
                          >
                            {/* option.text */}
                            {i18n.t(`settings:${namespace}.${_.camelCase(name)}Options.${_.camelCase(option.text)}`)}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {description !== '' && <FormHelperText>{description}</FormHelperText>}
                  </FormControl>
                );
              case 'textarea':
              case 'text':
              case 'custom':
              default:
                return (
                  <FormControl
                    key={key}
                    fullWidth
                    margin="normal"
                  >
                    <TextField
                      id={`${key}-id`}
                      key={key}
                      name={name}
                      value={meta[name]}
                      onChange={handleOnChange}
                      error={fields[name].error !== ''}
                      helperText={fields[name].error}
                      label={i18n.t(`settings:${namespace}.${_.camelCase(name)}`)}
                      // label={label}
                      margin="normal"
                      fullWidth
                      multiline={type === 'textarea'}
                      inputProps={{
                        maxLength: 300,
                        minLength: 3,
                      }}
                      // disabled={disabled}
                    />
                    {description !== '' && <FormHelperText>{description}</FormHelperText>}
                  </FormControl>
                );
            }
          })}
        </CardContent>
        <CardActions>
          <Button
            onClick={handleClose}
            fullWidth
          >
            {i18n.t('commons:close')}
          </Button>
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            disabled={isFetching}
          >
            {i18n.t('actions:update')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

SettingsMetaForm.propTypes = {
  namespace: PropTypes.string.isRequired,
  header: PropTypes.node.isRequired,
  formControllers: PropTypes.arrayOf(PropTypes.any),
  meta: PropTypes.objectOf(PropTypes.any),
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
};

SettingsMetaForm.defaultProps = {
  formControllers: [],
  meta: {},
};

export default SettingsMetaForm;
