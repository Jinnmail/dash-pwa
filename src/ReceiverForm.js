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

function ReceiverForm() {
  const [receiverAlias, setReceiverAlias] = React.useState('');
  const [generalErrorText, setGeneralErrorText] = React.useState('');

  const classes = useStyles();

  const receiverAliasChanged = (event) => {
    const textboxVal = event.target.value;
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      setReceiverAlias(textboxVal);
    }
    setGeneralErrorText('');
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
            onChange={receiverAliasChanged}
            inputProps={{ maxLength: 30 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter receiver's real email address"
            fullWidth
            // onChange={e => customDomainAliasChanged(e.target.value)}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Grid container>
            <Grid item xs={12} style={{ width: '250px', wordWrap: 'break-word' }}>
              {`${receiverAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div style={{ color: 'red', textAlign: "center" }}>
            {/* {generalErrorText} */}
          </div>
        </Grid>
        <Grid item md={3}>
          &nbsp;
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            // onClick={submitForm}
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
