import React from 'react';
import Img from 'react-image';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Link from '@material-ui/core/Link';
import MediaType from '../../../proptypes/Media';
import utils from '../../../utils';

const {
  getURL,
  getPortraitURL,
} = utils;

const styles = (theme) => {
  return {
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome.
      // This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.white,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  };
};

function SingleLineGridList(props) {
  const { classes, photos } = props;

  return (
    <React.Fragment>
      <GridList
        className={classes.gridList}
        cols={1.1}
        spacing={1}
        cellHeight={320}
      >
        {photos.map((photo) => {
          const src = getPortraitURL(photo);
          const url = getURL(photo);
          return (
            <GridListTile key={`gridlist-photo-${photo.id}`}>
              <Link href={url}>
                <Img
                  src={src}
                  alt={photo.name}
                  loader={<CircularProgress />}
                />
              </Link>
              {photo.name &&
                <GridListTileBar
                  title={photo.name}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                />
              }
            </GridListTile>
          );
        })}
      </GridList>
    </React.Fragment>
  );
}

SingleLineGridList.propTypes = {
  classes: PropTypes.object.isRequired,
  photos: PropTypes.arrayOf(MediaType.isRequired).isRequired,
};

export default withStyles(styles)(SingleLineGridList);
