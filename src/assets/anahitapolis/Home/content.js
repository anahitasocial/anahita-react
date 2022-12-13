import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import GithubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import WebsiteIcon from '@material-ui/icons/Web';

const cards = () => {
  return [{
    type: 'content',
    title: 'Getting Started',
    alias: 'getting-started',
    content: () => {
      return (
        <Typography variant="body1">
          Anahita has a Client Server architecture.
          You need to setup a serve side API and a client side app.
        </Typography>
      );
    },
    actions: () => {
      return (
        <>
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
        </>
      );
    },
  }, {
    type: 'content',
    alias: 'about',
    title: 'What is Anahita?',
    content: () => {
      return (
        <>
          <Typography variant="body1" paragraph>
            Anahita is a platform and framework for developing open science and
            knowledge-sharing applications on a social networking foundation.
          </Typography>
          <Typography variant="h6" paragraph>
            Concepts
          </Typography>
          <Typography variant="body1" paragraph>
            Anahita provides the essential nodes and graphs that you need for
            most of your projects. You can also build your custom apps with
            custom nodes and graphs to further extend your platform.
          </Typography>
          <Typography variant="h6" paragraph>
            Graph Architecture
          </Typography>
          <Typography variant="body1" paragraph>
            Anahita’s native framework provides a graph architecture and
            necessary design patterns that you need for developing social apps
            that work seamlessly with each other. Unlike conventional web
            applications, Anahita stores the app’s data as a network of
            interconnected nodes and graphs, making it ready for
            real-time analysis.
          </Typography>
          <Typography variant="h6" paragraph>
            A RAD Framework
          </Typography>
          <Typography variant="body1">
            We have developed Anahita using open source technologies globally
            accessible to developers, such as the LAMP stack and Javascript.
          </Typography>
          <ol>
            <li>MVC rapid app development framework specialized for building social apps.</li>
            <li>Fully customizable theme and user interfaces.</li>
            <li>Extendable by social apps and components.</li>
            <li>
              RESTful and JSON APIs (ideal to use Anahita as a back-end
              for mobile apps).
            </li>
          </ol>
          <Typography variant="h6" paragraph>
            Credits
          </Typography>
          <Typography variant="body1">
            {'Anahita is developed and maintained by '}
            <Link href="https://www.rmdstudio.com" target="_blank">rmd Studio</Link>
            .
          </Typography>
        </>
      );
    },
  }, {
    type: 'content',
    title: 'Support',
    alias: 'support',
    content: () => {
      return (
        <>
          <Typography variant="h6" paragraph>
            Community
          </Typography>
          <Typography variant="body1" paragraph>
            {'Join the Anahita tribe and then post your questions on the '}
            <Link href="/groups/107732-tribe-support/">Tribe Support</Link>
            {' group to get help from the members for free.'}
          </Typography>
          <Typography variant="h6" paragraph>
            Premium
          </Typography>
          <Typography variant="body1">
            <Link href="https://www.rmdstudio.com/contact/" target="_blank">Send an inquiry</Link>
            {' to the company who develops and maintains Anahita.'}
          </Typography>
        </>
      );
    },
  }, {
    type: 'content',
    alias: 'links',
    title: 'Follow #Anahita',
    actions: () => {
      return (
        <>
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
            href="https://www.facebook.com/anahita.io"
            target="_blank"
            aria-label="facebook"
          >
            <FacebookIcon />
          </IconButton>
        </>
      );
    },
  }, {
    type: 'nodes',
    title: 'Hashtags',
    subheader: 'Nodes + Tags',
    alias: 'hashtags',
    namespace: 'hashtags',
    limit: 5,
  }, {
    type: 'map',
    title: 'Locations',
    subheader: 'Nodes + Tags',
    alias: 'map',
    showList: true,
    limit: 20,
  }, {
    type: 'spacer',
  }, {
    type: 'media',
    alias: 'media',
  }, {
    type: 'spacer',
  }, {
    type: 'nodes',
    alias: 'people',
    namespace: 'people',
    ids: [5, 14071, 166682, 159157, 162324, 162072, 150163, 25896, 120085, 8146],
  }, {
    type: 'spacer',
  }, {
    type: 'spacer',
  }, {
    type: 'nodes',
    alias: 'groups',
    namespace: 'groups',
    ids: [84719, 26935, 42242, 10273, 107732, 143713, 128215, 21626],
    sort: 'top',
  }];
};

export default cards;
