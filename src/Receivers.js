import React, { forwardRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, Hidden, IconButton, InputAdornment, TextField } from '@material-ui/core';
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
import { observable, IObservableArray, action } from 'mobx';

import NavBar from './NavBar';
import { loggedIn } from './LoginUtil';
import { ReceiversStore } from './receivers-store';
import { emailAddressAllowed, randomString } from './functions';

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

function Receivers() {
  const [disabledMaster, setDisabledMaster] = useState(true);
  const [masterAlias, setMasterAlias] = React.useState('');
  const [masterAliasError, setMasterAliasError] = React.useState('');
  const [masterAliasErrorText, setMasterAliasErrorText] = React.useState('');
  const [generalErrorText, setGeneralErrorText] = React.useState('');
  const [receivers] = useState(() => new ReceiversStore())

  const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId

  useEffect(() => {
    async function fetchMasterAlias() {
      const res = await fetch(`${process.env.REACT_APP_API}/alias/master/${userId}`,
        {
          headers: { 'Authorization': localStorage.getItem('jinnmailToken') }
        });
      const json = await res.json();
      if (json.data) {
        setMasterAlias(json.data.alias);
        setDisabledMaster(true);
      } else {
        setDisabledMaster(true); // set to false when ready so not disabled
      }
    }
    fetchMasterAlias();
  }, [])

  const generateAlias = () => {
    const randStr = randomString(6);
    setMasterAlias(randStr);
    setGeneralErrorText('');
    setMasterAliasError(false);
    setMasterAliasErrorText('');
  }

  const data = [];
  data.push({alias: 'johndoe@receiver.jinnmail.com', receiver: receivers.realEmailAddresses[0]});
  data.push({alias: 'janedoe@receiver.jinnmail.com', receiver: receivers.realEmailAddresses[1]});

  const onMasterAliasChanged = (textboxVal) => {
    setMasterAliasError(false);
    setMasterAliasErrorText('');
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      setMasterAlias(textboxVal);
    }
    setGeneralErrorText('');
  }

  const aliasFoundSameUserId = () => {
    setGeneralErrorText('You already have this alias!');
  }

  const aliasFound = () => {
    setGeneralErrorText('Alias already in use or is not accepted.');
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
        setDisabledMaster(true);
        // dispatch(aliasCreated(res2json.data.aliasId));
        // props.handleCreateAliasModalClose();
      } else {
        setGeneralErrorText('alias was blacklisted, try another')
      }
    }
  }

  const submitForm = () => {
    if (masterAlias) {
      checkAlias(`${masterAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`, masterAlias);
    } else {
      setMasterAliasError(true);
      setMasterAliasErrorText('Required');
    }
  }

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
          disabled={disabledMaster}
          onChange={e => onMasterAliasChanged(e.target.value)}
          error={masterAliasError}
          helperText={masterAliasErrorText}
          value={masterAlias}
          inputProps={{ maxLength: 30 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={generateAlias} disabled={disabledMaster}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={4} md={8}>&nbsp;</Grid>
      <Grid item xs={8} md={4}>
        <Button 
          variant="contained" 
          color="primary"
          fullWidth
          onClick={submitForm}
          disabled={disabledMaster}
        >
          Create
        </Button>
      </Grid>
      <Grid item xl={4} md={8}>&nbsp;</Grid>
      <Grid item xs={4}>
        <div style={{ color: 'red', textAlign: "left" }}>
          {generalErrorText}
        </div>
      </Grid>
      <Grid item xs={8}>&nbsp;</Grid>
      <Grid item xs={12}>
        <MaterialTable
          title=''
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
          ]}
          data={data}
        />
      </Grid>
    </Grid>
  )
}

export default withRouter(Receivers);