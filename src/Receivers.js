import React, { forwardRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, IconButton, InputAdornment, Modal, Switch, TextField, Tooltip } from '@material-ui/core';
import MaterialTable from "material-table";
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
import { useObserver } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import {container} from 'tsyringe';

import NavBar from './NavBar';
import { loggedIn } from './LoginUtil';
import { ReceiversStore } from './receivers-store';
import { emailAddressAllowed, randomString } from './functions';
import ReceiverForm from './ReceiverForm';
// import { useInjection } from './hooks/use-injection';

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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function Receivers() {
  let data = [];
  const receiverStore = container.resolve(ReceiversStore.TOKEN);
  const [masterAliasError, setMasterAliasError] = React.useState('');
  const [masterAliasErrorText, setMasterAliasErrorText] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);

  const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId

  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      await receiverStore.fetchData();
    };
    fetchData();
  }, [])

  const openModalOnClick = () => {
    setOpenModal(true);
  }

  const closeModalOnClose = () => {
    setOpenModal(false);
  };
  const onMasterAliasChanged = (textboxVal) => {
    setMasterAliasError(false);
    setMasterAliasErrorText('');
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      receiverStore.setMasterAlias({alias: textboxVal});
    }
    receiverStore.generalErrorText = '';
  }

  const aliasFoundSameUserId = () => {
    receiverStore.generalErrorText = 'You already have this alias!';
  }

  const aliasFound = () => {
    receiverStore.generalErrorText ='Alias already in use or is not accepted.';
  }

  const checkAlias = async (link, alias) => {
    const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
    const res = await fetch(`${process.env.REACT_APP_API}/alias/checkAlias`, {
      method: 'GET',
      headers: { 'Authorization': localStorage.getItem("jinnmailToken") },
    });
    const json = await res.json();
    const matchedAlias = json.data.filter(a => a.alias === link)
    if (matchedAlias.length > 0) {
      if (matchedAlias[0].userId === userId) {
        aliasFoundSameUserId();
      } else {
        aliasFound()
      }
    } else { // create new master alias 
      link = link.substring(0, link.lastIndexOf('@'))
      alias = `http://${link}.com`
      const res2 = await fetch(`${process.env.REACT_APP_API}/alias/master`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("jinnmailToken"),
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ url: alias, source: 'cust' })
      })
      const res2json = await res2.json();
      if (!res2json.error) {
        receiverStore.disabledMaster = true;
        // dispatch(aliasCreated(res2json.data.aliasId));
        // props.handleCreateAliasModalClose();
      } else {
        receiverStore.generalErrorText = 'alias was blacklisted, try another';
      }
    }
  }

  const submitForm = () => {
    if (receiverStore.masterAlias) {
      checkAlias(`${receiverStore.masterAlias.alias}${process.env.REACT_APP_EMAIL_DOMAIN}`, receiverStore.masterAlias.alias);
    } else {
      setMasterAliasError(true);
      setMasterAliasErrorText('Required');
    }
  }

  return useObserver(() => {
    receiverStore.rows.map((row) => (
      data.push({
        alias: row.alias,
        receiver: row.receiver,
        toggle:
          <Switch
            checked={row.status}
            onChange={() => receiverStore.onToggleChange(row.aliasId, !row.status)}
            color="secondary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />,
        delete: ''
      })
    ));

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loggedIn() && <NavBar />}
        </Grid>
        <Grid item xs={12}>
          <h3 style={{ color: 'gray' }}>Receiver aliases is a new feature slowly being rolled out.</h3>
          <h3 style={{ color: 'gray' }}>Jinnmail users will be able to email someone with their master alias directly.</h3>
        </Grid>
        <Grid item xs={12}>
          <b style={{ color: 'gray' }}>All messages will appear to be from your master alias.</b>
        </Grid>
        <Grid item xs={8} md={4}>
          <TextField
            label="Hit ⟳ to generate"
            variant="outlined"
            fullWidth
            disabled={receiverStore.disabledMaster}
            onChange={e => onMasterAliasChanged(e.target.value)}
            error={masterAliasError}
            helperText={masterAliasErrorText}
            value={receiverStore?.masterAlias?.alias ? receiverStore?.masterAlias.alias : ''}
            inputProps={{ maxLength: 30 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={receiverStore.generateAlias} disabled={receiverStore.disabledMaster}>
                    <RefreshIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={4} md={8}>&nbsp;</Grid>
        <Grid item xs={12}>
          <div style={{ color: 'red', textAlign: "left" }}>
            {receiverStore.generalErrorText}
          </div>
        </Grid>
        <Grid item xs={8} md={4}>
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            onClick={submitForm}
            disabled={receiverStore.disabledMaster}
          >
            Create
          </Button>
        </Grid>
        <Grid item xs={12}>
          <IconButton>
            <AddIcon onClick={openModalOnClick} />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            title=""
            icons={tableIcons}
            columns={[
              {
                title: "Receiver Alias (Send  here)",
                field: 'alias',
              },
              {
                title: "Receiver Real",
                field: "receiver",
              },
              {
                title: "",
                field: 'toggle'
              }, 
              // {
              //   title: "",
              //   field: 'delete'
              // }
            ]}
            data={data}
            // data={receiverStore.rows}
          />
          <Modal
            open={openModal}
            onClose={closeModalOnClose}
            className={classes.modal}
          >
            <ReceiverForm
              handleCreateAliasModalClose={closeModalOnClose}
            />
          </Modal>
        </Grid>
      </Grid>
  )});
}

export default withRouter(Receivers);