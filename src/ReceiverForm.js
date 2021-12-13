import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';

import { emailAddressAllowed } from './functions';

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

function ReceiverForm(props) {
  const [receiverAlias, setReceiverAlias] = React.useState('');
  const [receiverAliasError, setReceiverAliasError] = React.useState('');
  const [receiverAliasErrorText, setReceiverAliasErrorText] = React.useState('');
  const [receiverReal, setReceiverReal] = React.useState('');
  const [receiverRealError, setReceiverRealError] = React.useState('');
  const [receiverRealErrorText, setReceiverRealErrorText] = React.useState('');
  const [generalErrorText, setGeneralErrorText] = React.useState('');

  const classes = useStyles();

  const receiverAliasChanged = (event) => {
    const textboxVal = event.target.value;
    setReceiverAliasError(false);
    setReceiverAliasErrorText('');
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      setReceiverAlias(textboxVal);
    }
    setGeneralErrorText('');
  }

  const receiverRealChanged = (event) => {
    const textboxVal = event.target.value;
    setReceiverRealError(false);
    setReceiverRealErrorText('');
    setReceiverReal(textboxVal);
    setGeneralErrorText('');
  }

  const aliasFoundSameUserId = () => {
    setGeneralErrorText('You already have this alias!');
  }

  const aliasFound = () => {
    setGeneralErrorText('Alias already in use or is not accepted.');
  }

  const checkAlias = async (alias, link) => {
    const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
    const res = await fetch(`${process.env.REACT_APP_API}/alias/checkAlias`, {
      method: 'GET',
      headers: { 'Authorization': localStorage.getItem("jinnmailToken") },
    });
    const json = await res.json();
    const matchedAlias = json.data.filter(a => a.alias === alias)
    if (matchedAlias.length > 0) {
      if (matchedAlias[0].userId === userId) {
        aliasFoundSameUserId();
      } else {
        aliasFound()
      }
    } else { // create new alias 
      link = link.substring(0, link.lastIndexOf('@'))
      alias = `http://${link}.com`
      const res2 = await fetch(`${process.env.REACT_APP_API}/alias/receiver`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem("jinnmailToken"),
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ url: alias, source: 'cust', domainAlias: alias, realEmail: receiverReal})
      })
      const res2json = await res2.json();
      if (!res2json.error) {
        // dispatch(aliasCreated(res2json.data.aliasId));
        props.handleCreateAliasModalClose();
      } else {
        setGeneralErrorText(res2json.error.message)
      }
    }
  }

  const submitForm = () => {
    if (receiverAlias) {
      checkAlias(
        `${receiverAlias}${process.env.REACT_APP_RECEIVER_DOMAIN}`,
        `${receiverAlias}${process.env.REACT_APP_RECEIVER_DOMAIN}`,
      );
    } else {
      setReceiverAliasError(true);
      setReceiverAliasErrorText('Required');
    }
    if (receiverReal) {
      if (!emailAddressAllowed(receiverReal)) {
        setReceiverRealError(true);
        setReceiverRealErrorText('Invalide email address');
      }
    } else {
      setReceiverRealError(true);
      setReceiverRealErrorText('Required');
    }
  }

  return (
    <FormControl className={classes.paper}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItmes="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <h2>Create Receiver</h2>
        </Grid>
        <Grid item xs={12}>
          Aliases must be unique. Use email-safe chars: -, +, 0-9, A-Z, _, a-z, no leading, trailing, or consecutive dots.
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter receiver's alias"
            fullWidth
            error={receiverAliasError}
            helperText={receiverAliasErrorText}
            onChange={receiverAliasChanged}
            inputProps={{ maxLength: 30 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter receiver's real email address"
            fullWidth
            error={receiverRealError}
            helperText={receiverRealErrorText}
            onChange={receiverRealChanged}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Grid container>
            <Grid item xs={12} style={{ width: '250px', wordWrap: 'break-word' }}>
              {`${receiverAlias}${process.env.REACT_APP_RECEIVER_DOMAIN}`}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div style={{ color: 'red', textAlign: "center" }}>
            {generalErrorText ? generalErrorText : '\u00A0'}
          </div>
        </Grid>
        <Grid item md={3}>
          &nbsp;
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={submitForm}
            fullWidth
          >
            Create receiver
          </Button>
        </Grid>
        <Grid item md={3}>
          &nbsp;
        </Grid>
      </Grid>
    </FormControl>
  )
}

export default ReceiverForm;
