import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import Link from '@material-ui/core/Link';
// import Typography from '@material-ui/core/Typography';

import GithubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import WebsiteIcon from '@material-ui/icons/Web';

const cards = () => {
  return [{
    type: 'content',
    title: 'Getting Started',
    alias: 'getting-started',
    subtitle: '',
    content: () => {
      return (
        <React.Fragment>
          Anahita has a Client Server architecture.
          You need to setup a serve side API and a client side app.
        </React.Fragment>
      );
    },
    actions: () => {
      return (
        <React.Fragment>
          <Button
            href="https://github.com/anahitasocial/anahita"
            target="_blank"
            color="primary"
            startIcon={<GithubIcon />}
            fullWidth
            variant="contained"
          >
            Server
          </Button>
          <Button
            href="https://github.com/anahitasocial/anahita-react"
            target="_blank"
            color="primary"
            startIcon={<GithubIcon />}
            fullWidth
            variant="contained"
          >
            Client
          </Button>
        </React.Fragment>
      );
    },
  }, {
    type: 'content',
    alias: 'socialmedia',
    title: 'Social Media',
    subtitle: '',
    actions: () => {
      return (
        <React.Fragment>
          <IconButton
            href="https://www.rmdstudio.com"
            target="_blank"
            aria-label="website"
            title="rmd Studio website"
          >
            <WebsiteIcon />
          </IconButton>
          <IconButton
            href="https://github.com/anahitasocial/anahita"
            target="_blank"
            aria-label="github-server"
            title="Anahita Server"
          >
            <GithubIcon />
          </IconButton>
          <IconButton
            href="https://github.com/anahitasocial/anahita-react"
            target="_blank"
            aria-label="github-client"
            title="Anahita Client"
          >
            <GithubIcon />
          </IconButton>
          <IconButton
            href="https://www.facebook.com/anahitasocial"
            target="_blank"
            aria-label="facebook"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            href="https://www.twitter.com/anahitapolis"
            target="_blank"
            aria-label="twitter"
          >
            <TwitterIcon />
          </IconButton>
        </React.Fragment>
      );
    },
  }];
};

export default cards;
