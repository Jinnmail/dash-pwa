import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AliasForm from './AliasForm';
import ConfirmAliasDeletion from './ConfirmAliasDeletion';
import {detectURL} from './functions';
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import { loggedIn } from './LoginUtil';
import NavBar from './NavBar';
import {
  fetchUserAliases,
  fetchUser, 
  nameChanged2, 
  updateName, 
  setToggle, 
  selectUserAliases, 
  setNameTextReadOnly, 
  setNameButtonText, 
} from './userAliasesSlice';
import {
  Button, 
  Chip,  
  Grid, 
  IconButton,   
  Modal, 
  Switch, 
  TextField, 
  Tooltip
} from '@material-ui/core';
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
  MailOutline as MailOutlineIcon,  
  Refresh as RefreshIcon, 
} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { getUserId } from './app-helper';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

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
  }, 
}));

function Dashboard() {
  const userAliases = useSelector(selectUserAliases);
  const userAliasesStatus = useSelector((state) => state.userAliases.status);
  const user = useSelector((state) => state.userAliases.user);
  const error = useSelector((state) => state.userAliases.error);
  const [openCopyAliasTooltip, setOpenCopyAliasTooltip] = useState('Copy alias');
  const [openCreateAliasModal, setCreateAliasModalOpen] = useState(false);
  const [mode, setMode] = useState('online');

  useEffect(() => {
    if (!navigator.onLine) {
      setMode('offline')
    }
  }, [navigator.onLine])

  const classes = useStyles();
  
  const dispatch = useDispatch();

  let content;
  let data = [];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    if (userAliasesStatus === 'idle') {
      dispatch(fetchUserAliases())
    }
    const userId = getUserId()
    dispatch(fetchUser(userId))
  }, [userAliasesStatus, dispatch]); // status as in get status not alias.status

  const editNameClicked = (aliasId, buttonText) => {
    if (buttonText === 'edit') {
      dispatch(setNameTextReadOnly({aliasId: aliasId, readOnly: false}));
      dispatch(setNameButtonText({aliasId: aliasId, buttonText: 'save'}))
    } else { // save
      const existingUserAlias = userAliases.find(userAlias => userAlias.aliasId === aliasId)
      if (existingUserAlias) {
        dispatch(updateName({aliasId: aliasId, name: existingUserAlias.refferedUrl}));
        dispatch(setNameTextReadOnly({aliasId: aliasId, readOnly: true}));
        dispatch(setNameButtonText({aliasId: aliasId, buttonText: 'edit'}))
      }
    }
  } 

  const nameChanged = (e, aliasId) => {
    dispatch(nameChanged2({aliasId: aliasId, refferedUrl: e.target.value}))
  }

  const openAndFillClicked = (refferedUrl) => {
    if (!(refferedUrl.startsWith('http://') || refferedUrl.startsWith('https://'))) {
      refferedUrl = `https://${refferedUrl}`;
    }
    window.open(refferedUrl, "_blank")
    // window.location = refferedUrl;
  }

  const copyAliasClicked = (alias) => {
    var aux = document.createElement("input");
    aux.setAttribute("value", alias);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    setOpenCopyAliasTooltip('Copied!');
  };

  const closeAliasTooltip = () => {
    setOpenCopyAliasTooltip('Copy alias');
  };

  const onToggleChange = (aliasId, newStatus) => {
    dispatch(setToggle({aliasId: aliasId, newStatus: !newStatus}));
  }

  const handleCreateAliasModalOpen = () => {
    setCreateAliasModalOpen(true);
  };

  const handleCreateAliasModalClose = () => {
    setCreateAliasModalOpen(false);
  };

  if (userAliasesStatus === 'loading') {     
    content = <div>Loading...</div>
  } else if (userAliasesStatus === 'succeeded') {
    userAliases.map((userAlias) => (
      data.push({
        name: 
          <Grid container>
            <Grid item xs={12}>
              <TextField
                value={userAlias.refferedUrl}
                fullWidth
                inputProps={{
                  style: {fontSize: 12},
                  readOnly: userAlias.nameTextReadOnly,
                  width: '50%'
                }}
                onChange={(event) => nameChanged(event, userAlias.aliasId)}
              />
            </Grid>
            <Grid item xs={12}>
              <button disabled={userAlias.editDisabled} onClick={()=> editNameClicked(userAlias.aliasId, userAlias.nameButtonText)}>{userAlias.nameButtonText}</button>
            </Grid>
          </Grid>
        , 
        alias: userAlias.alias, 
        date: `${monthNames[new Date(userAlias.created).getMonth()]} ${new Date(userAlias.created).getDate()}, ${new Date(userAlias.created).getFullYear()}`,
        copyAlias: 
          <Tooltip title={openCopyAliasTooltip} onClose={closeAliasTooltip} enterDelay={100} leaveDelay={1000}>
            <IconButton onClick={() => copyAliasClicked(userAlias.alias)}><FileCopyIcon color="primary" /></IconButton>
          </Tooltip>,
        openAndFill: 
            detectURL(userAlias.refferedUrl)
            ?
              <Tooltip title={userAlias.refferedUrl}>
                <Button style={{fontSize: 8}} variant="outlined" onClick={() => openAndFillClicked(userAlias.refferedUrl)}>Open & Fill &gt;</Button>
              </Tooltip>
            : <div></div>,
        toggle: 
          <Switch
            checked={userAlias.status}
            onChange={() => onToggleChange(userAlias.aliasId, userAlias.status)}
            color="secondary"
            inputProps={{'aria-label': 'primary checkbox'}}
          />, 
          // <IconButton>
          //   {userAlias.status
          //     ? <ToggleOnIcon color="secondary" onClick={() => toggleOnClicked(userAlias.aliasId, false)} />
          //     : <ToggleOffIcon color="" onClick={() => toggleOffClicked(userAlias.aliasId, true)} />
          //   }
          // </IconButton>,  
        delete:
          <ConfirmAliasDeletion aliasId={userAlias.aliasId} alias={userAlias.alias} />
        // receivers: ''
      })
    ))
    content = 
      <div>
        <MaterialTable 
          title=''
          icons={tableIcons}
          columns={[
            {
              title: "Name",
              field: "name",
            }, 
            {
              title: "Alias",
              field: 'alias',
            }, 
            {title: "", field: "copyAlias"},
            {title: "", field: "openAndFill"},
            {title: "Created", field: 'date'},
            {title: "", field: "toggle"},
            {title: "", field: "delete"}
          ]}
          data={data}
        />
        <Modal
          open={openCreateAliasModal}
          onClose={handleCreateAliasModalClose}
          className={classes.modal}
        >
          {/* <FormControl className={classes.paper}>
            <TextField>My name is</TextField>
          </FormControl> */}
          <AliasForm handleCreateAliasModalClose={handleCreateAliasModalClose} />
        </Modal>
      </div>
  } else if (userAliasesStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loggedIn() && <NavBar />}
        </Grid>
        <Grid item xs={12}>
          <div>
            <div>
              {
                (mode === 'offline') 
                ? <Alert severity="warning">you are in offline mode or some issue with connection</Alert>
                : <div>&nbsp;</div>
              }
            </div>
            <MailOutlineIcon iconStyle={classes.smallIcon} style={{verticalAlign: 'middle', width: 20, height: 20}}></MailOutlineIcon> 
            <small>&nbsp; {user && user.invites} Premium Invites Remaining</small>
          </div>
          <div>
            <Link to='/invites' style={{textDecoration: 'none'}}>
              <Button variant="outlined" color="primary">
                Manage Invites &gt;
              </Button>
            </Link>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Chip size="small" icon={<FavoriteIcon />} label="PREMIUM ACTIVATED" />
        </Grid>
        <Grid item xs={10} md={3}>
          <Button variant="contained" color="primary" fullWidth onClick={handleCreateAliasModalOpen}>+ Create New Alias</Button>
        </Grid>
        <Grid item xs={2} md={9}></Grid>
        <Grid item xs={12}>
          {content}
        </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard;
