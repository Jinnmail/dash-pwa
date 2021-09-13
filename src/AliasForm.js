import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useDispatch} from 'react-redux';
import {
  aliasCreated, 
} from './userAliasesSlice';
import {
  Button,   
  FormControl, 
  Grid, 
  IconButton, 
  InputAdornment,  
  TextField, 
} from '@material-ui/core';
import { 
  DeleteForever as DeleteForeverIcon, 
  ExitToApp as ExitToAppIcon,
  FileCopy as FileCopyIcon,  
  Favorite as FavoriteIcon, 
  Refresh as RefreshIcon, 
  ToggleOn as ToggleOnIcon, 
  ToggleOff as ToggleOffIcon
} from '@material-ui/icons';

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

function AliasForm(props) {
  const classes = useStyles();
  const [customDomainAlias,setCustomDomainAlias] = React.useState('');
  const [customAlias, setCustomAlias] = React.useState('');
  const [customAliasError, setCustomAliasError] = React.useState('');
  const [customAliasErrorText, setCustomAliasErrorText] = React.useState('');
  const [generalErrorText, setGeneralErrorText] = React.useState('');

  const dispatch = useDispatch();

  function emailAddressAllowed(email) {
    var emailRegex = /^[-+0-9A-Z_a-z](\.?[-+0-9A-Z_a-z])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  
    if (!email)
        return false;
  
    if(email.length > 254)
        return false;
  
    var valid = emailRegex.test(email);
    if(!valid)
        return false;
  
    var parts = email.split("@");
    if(parts[0].length > 64)
        return false;
  
    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length > 63; }))
        return false;
  
    return true;
  }

  const randomString = (string_length) => {
    let chars = "0123456789abcdefghiklmnopqrstuvwxyz";
    let randomstring = '';
    for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  const generateAlias = () => {
    const randStr = randomString(6); 
    setCustomAlias(randStr);
    setGeneralErrorText('');
    setCustomAliasError(false);
    setCustomAliasErrorText('');
  }

  const customDomainAliasChanged = (textboxVal) => {
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      setCustomDomainAlias(textboxVal);
    }
    setGeneralErrorText('');
  }

  const customAliasChanged = (textboxVal) => {
    setCustomAliasError(false);
    setCustomAliasErrorText('');
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      setCustomAlias(textboxVal);
    }
    setGeneralErrorText('');
  }

  const aliasFoundSameUserId = () => {
    setGeneralErrorText('You already have this alias!');
  }

  const aliasFound = () => {
    setGeneralErrorText('Alias already in use or is not accepted.');
  }

  const checkAlias = async (link, alias, domainAlias) => {
    const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
    const res = await fetch(`${process.env.REACT_APP_API}/alias/checkAlias`, {
      method: 'GET', 
      headers: {'Authorization': localStorage.getItem("jinnmailToken")}, 
    });
    const json = await res.json();
    const matchedAlias = json.data.filter(a => a.alias === link)
    if (matchedAlias.length > 0) {
      if (matchedAlias[0].userId === userId) { 
          aliasFoundSameUserId();
      } else {
          aliasFound()
      }
    } else { // create new alias 
      link = link.substring(0, link.lastIndexOf('@'))
      alias = `http://${link}.com`
      const res2 = await fetch(`${process.env.REACT_APP_API}/alias`, {
        method: 'POST', 
        headers: {
          'Authorization': localStorage.getItem("jinnmailToken"), 
          'Content-type': 'application/json'
        }, 
        body: JSON.stringify({ url: alias, source: 'cust', domainAlias: domainAlias})
      })
      const res2json = await res2.json();
      if (!res2json.error) {
        dispatch(aliasCreated(res2json.data.aliasId));
        props.handleCreateAliasModalClose();
      } else {
        setGeneralErrorText('alias was blacklisted, try another')
      }
    }
  }

  const submitForm = () => {
    if (customAlias) {
      if(customDomainAlias) {
        checkAlias(
          `${customDomainAlias}.${customAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`, 
          `${customAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`, 
          `${customDomainAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`)
      } else {
        checkAlias(`${customAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`, customAlias, customDomainAlias)
      } 
    } else {
      setCustomAliasError(true);
      setCustomAliasErrorText('Required');
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
          <h2>Create New Alias</h2>
        </Grid>
        <Grid item xs={12}>
          Aliases must be unique. Use email-safe chars: -, +, 0-9, A-Z, _, a-z, no leading, trailing, or consecutive dots.
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="(Optional) Enter domain / app / name"
            fullWidth
            onChange={e => customDomainAliasChanged(e.target.value)}
            inputProps={{maxLength: 30}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='customAlias'
            className={classes.margin}
            label="Hit ⟳ to generate"
            fullWidth
            autoFocus
            // helperText="Customize or accept"
            error={customAliasError}
            helperText={customAliasErrorText}
            value={customAlias}
            onChange={e => customAliasChanged(e.target.value)}
            inputProps={{maxLength: 30}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={generateAlias}>
                    <RefreshIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Grid container>
            <Grid item xs={12} style={{width: '250px', wordWrap: 'break-word'}}>
            {customAlias 
              ? customDomainAlias 
                ? `${customDomainAlias}.${customAlias}${process.env.REACT_APP_EMAIL_DOMAIN}` 
                : `${customAlias}${process.env.REACT_APP_EMAIL_DOMAIN}`
              : process.env.REACT_APP_EMAIL_DOMAIN
            }
            </Grid>  
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div style={{color: 'red', textAlign: "center"}}>
            {generalErrorText}
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
            Create a custom email
          </Button>
        </Grid>
        <Grid item md={3}>
          &nbsp;
        </Grid>
      </Grid>
    </FormControl>
  );
}

export default AliasForm;