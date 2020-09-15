import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import EntityBody from '../../EntityBody';
import ActorType from '../../../proptypes/Actor';
import contentfilter from '../../contentfilter';

const ActorBodyAbout = (props) => {
  const { actor: { body } } = props;

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h3"
            style={{
              fontSize: 24,
            }}
          >
            About
          </Typography>
        }
      />
      <CardContent>
        <EntityBody>
          {contentfilter({
            text: body,
            filters: [
              'hashtag',
              'mention',
              'url',
            ],
          })}
        </EntityBody>
      </CardContent>
    </Card>
  );
};

ActorBodyAbout.propTypes = {
  actor: ActorType.isRequired,
};

export default ActorBodyAbout;
