import React from 'react';
import Img from 'react-image';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import Link from '@material-ui/core/Link';
import MediaType from '../../../proptypes/Media';
import utils from '../../../utils';

const {
  getURL,
  getPortraitURL,
} = utils.node;

const styles = (theme) => {
  return {
    imageList: {
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

function SingleLineImageList(props) {
  const { classes, photos } = props;

  return (
    <>
      <ImageList
        className={classes.imageList}
        cols={1.1}
        gap={1}
        rowHeight={320}
      >
        {photos.map((photo) => {
          const src = getPortraitURL(photo);
          const url = getURL(photo);
          return (
            <ImageListItem key={`gridlist-photo-${photo.id}`}>
              <Link href={url}>
                <Img
                  src={src}
                  alt={photo.name}
                  loader={<CircularProgress />}
                />
              </Link>
              {photo.name &&
                <ImageListItemBar
                  title={photo.name}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                />}
            </ImageListItem>
          );
        })}
      </ImageList>
    </>
  );
}

SingleLineImageList.propTypes = {
  classes: PropTypes.object.isRequired,
  photos: PropTypes.arrayOf(MediaType.isRequired).isRequired,
};

export default withStyles(styles)(SingleLineImageList);
