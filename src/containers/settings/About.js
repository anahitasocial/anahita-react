import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import AboutIcon from '@material-ui/icons/Info';

import i18n from '../../languages';
import Progress from '../../components/Progress';
import actions from '../../actions';
import AboutType from '../../proptypes/settings/About';
import packageInfo from '../../../package.json';

const useStyles = makeStyles((theme) => {
  return {
    logo: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  };
});

const SettingsAbout = (props) => {
  const {
    readAbout,
    about: {
      title,
      version,
      logo,
      license,
      website,
    },
    isFetching,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    readAbout();
  }, [readAbout]);

  if (isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Typography variant="h4">
            {i18n.t('settings:about.cTitle')}
          </Typography>
        }
        avatar={
          <Avatar>
            <AboutIcon />
          </Avatar>
        }
      />
      <List>
        <ListItem divider>
          <ListItemAvatar>
            <Avatar
              src={logo}
              alt={title}
              className={classes.logo}
            />
          </ListItemAvatar>
          <ListItemText
            primary={title}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={i18n.t('settings:about.apiVersion')}
            secondary={version}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={i18n.t('settings:about.clientVersion')}
            secondary={packageInfo.version}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={i18n.t('settings:about.license')}
            secondary={
              <Link
                href={license.url}
                target="blank"
              >
                {license.name}
              </Link>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('settings:about.website')}
            secondary={
              <Link
                href={website.url}
                target="blank"
              >
                {website.name}
              </Link>
            }
          />
        </ListItem>
      </List>
    </Card>
  );
};

SettingsAbout.propTypes = {
  about: AboutType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  readAbout: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readAbout: () => {
      dispatch(actions.settings.about.read());
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_about: {
      current: about,
    },
    isFetching,
  } = state.settingsAbout;

  return {
    about,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAbout);
