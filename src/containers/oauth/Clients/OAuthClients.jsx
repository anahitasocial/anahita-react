import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import OAuthMenu from './Menu';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
    },
    tableContainer: {
      marginTop: theme.spacing(2),
    },
    activeChip: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.common.white,
    },
    inactiveChip: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
    },
    grantChip: {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    loadingBox: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(4),
    },
    emptyBox: {
      padding: theme.spacing(4),
      textAlign: 'center',
    },
  };
});

const OAuthClients = ({
  items,
  isFetching = false,
  canAdd = false,
  canEdit = false,
  canDelete = false,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box className={classes.header}>
        <Typography variant="h5">OAuth Clients</Typography>
        {canAdd && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Add Client
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} className={classes.tableContainer}>
        {isFetching && (
          <Box className={classes.loadingBox}>
            <CircularProgress />
          </Box>
        )}
        {!isFetching && items.length === 0 && (
          <Box className={classes.emptyBox}>
            <Typography color="textSecondary">No OAuth clients yet.</Typography>
          </Box>
        )}
        {!isFetching && items.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Grant Types</TableCell>
                <TableCell>Confidential</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((client) => {
                return (
                  <TableRow key={client.id} hover>
                    <TableCell>{client.clientId}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>
                      {client.grantTypes && client.grantTypes.map((grant) => {
                        return (
                          <Chip
                            key={grant}
                            label={grant}
                            size="small"
                            variant="outlined"
                            className={classes.grantChip}
                          />
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.confidential ? 'Yes' : 'No'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.active ? 'Active' : 'Inactive'}
                        size="small"
                        className={client.active ? classes.activeChip : classes.inactiveChip}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(client.createTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <OAuthMenu
                        client={client}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
};

OAuthClients.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    clientId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    grantTypes: PropTypes.arrayOf(PropTypes.string),
    confidential: PropTypes.bool,
    active: PropTypes.bool,
    createTime: PropTypes.string,
  })).isRequired,
  isFetching: PropTypes.bool,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OAuthClients;
