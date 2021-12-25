
import React, {Fragment, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {
  fetchUserAliases, 
  updateName, 
  deleteAlias, 
  deleteProxymail, 
  setToggle, 
  selectUserAliases, 
  setNameTextReadOnly, 
  setNameButtonText
} from './userAliasesSlice';
import {
  AddBox, 
  ArrowDownward, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clear, 
  DeleteOutline, 
  Edit, 
  FilterList, 
  FirstPage, 
  LastPage, 
  Remove, 
  SaveAlt, 
  Search, 
  ViewColumn, 
  DeleteForever as DeleteForeverIcon, 
  ExitToApp as ExitToAppIcon,
  FileCopy as FileCopyIcon,  
  Favorite as FavoriteIcon, 
  Refresh as RefreshIcon, 
  ToggleOn as ToggleOnIcon, 
  ToggleOff as ToggleOffIcon
} from '@material-ui/icons';
import {
  Box, 
  Button, 
  Chip, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,  
  FormControl, 
  Grid, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  LinearProgress, 
  Modal, 
  TextField, 
  Tooltip
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dashboard: {
    maxwidth: "100%", padding: "10px"
  }, 
  rotate: {
    transform: "rotate(-180deg)"
  }, 
  paper: {
    position: 'absolute',
    // width: 800,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

function ConfirmAliasDeletion(props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const dispatch = useDispatch();

  const {aliasId, alias} = props

  const classes = useStyles();

  const handleClickModalOpen = () => {
    setModalOpen(true);
  }

  const handleModalClose = (agree) => {
    if (agree === true) { // explicity test for true hitting backdrop passes an object
      dispatch(deleteAlias(aliasId));
      dispatch(deleteProxymail(aliasId));
    }
    setModalOpen(false);
  }

  // const deleteAliasClicked = async (aliasId) => {
  //   alert(aliasId)
    // const res = await fetch(`${process.env.REACT_APP_API}/alias/${aliasId}`, {
    //   method: 'DELETE', 
    //   headers: {
    //     'Content-type': 'application/json', 
    //     'Authorization': localStorage.getItem('jinnmailToken')},
    // })
    // const json = await res.json();

    // const res2 = await fetch(`${process.env.REACT_APP_API}/alias`, 
    //   // {headers: {'Authorization': localStorage.getItem('jinnmailToken')}
    //   {headers: {'Authorization': localStorage.getItem('jinnmailToken')}
    // })
    // const json2 = await res2.json()
    // const userAliases = json2.data
    // this.setState({userAliases: userAliases})
  // }

  return (
    <div>
      <IconButton>
        <DeleteForeverIcon onClick={handleClickModalOpen} /> 
      </IconButton>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-descriptixon"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to permanently delete this alias?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will not be able to use {alias} ever again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModalClose(false)} color="primary">
            Nevermind
          </Button>
          <Button onClick={() => handleModalClose(true)} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmAliasDeletion;