// The dense toolbar the stepper puts above us, plus its divider.
const HEADER_HEIGHT = 49;
const PANE_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

export default (theme) => {
  return {
    root: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      [theme.breakpoints.up('md')]: {
        overflow: 'hidden',
      },
    },
    mediaPane: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      userSelect: 'none',
      backgroundColor: '#000',
      height: PANE_HEIGHT,
      [theme.breakpoints.down('sm')]: {
        height: '60vh',
        minHeight: 240,
      },
    },
    portrait: {
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.short,
      }),
    },
    portraitLoaded: {
      opacity: 1,
    },
    zoomButton: {
      display: 'flex',
      minHeight: 0,
      maxWidth: '100%',
      maxHeight: '100%',
      padding: 0,
      border: 0,
      background: 'none',
      cursor: 'zoom-in',
    },
    zoomExit: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
      zIndex: 1,
    },
    mediaPaneZoomed: {
      overflow: 'auto',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      cursor: 'grab',
    },
    mediaPanePanning: {
      cursor: 'grabbing',
    },
    // At natural size inside a scrolling pane, so the browser handles panning
    // on touch and the drag handlers only have to cover the mouse.
    portraitZoomed: {
      maxWidth: 'none',
      maxHeight: 'none',
    },
    spinner: {
      position: 'absolute',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    overlayNav: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
    overlayNavButton: {
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
      },
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.25)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
    overlayNavPrev: {
      left: theme.spacing(1),
    },
    overlayNavNext: {
      right: theme.spacing(1),
    },
    details: {
      height: PANE_HEIGHT,
      overflowY: 'auto',
      [theme.breakpoints.down('sm')]: {
        height: 'auto',
        overflowY: 'visible',
      },
    },
    detailsInner: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 720,
    },
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(2),
    },
    tabs: {
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    footerNav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
    },
  };
};
