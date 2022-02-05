import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Switch} from '@material-ui/core'
import {Button, Grid, IconButton, InputAdornment, Modal, TextField, Typography} from '@mui/material'
import {Add as AddIcon, Refresh as RefreshIcon} from '@mui/icons-material'

import {emailAddressAllowed} from './functions'
import ReceiverForm from './ReceiverForm'
import ConfirmAliasDeletion from './ConfirmAliasDeletion'
import CopiedTooltip from './copied-tooltip'
import {
  fetchData, fetchMasterAlias, generateMasterAlias, onToggleChange, selectDisabledMaster, setDisabledMaster, setGeneralErrorText, 
  selectMasterAlias, selectMasterAliasError, selectMasterAliasErrorText, setMasterAlias, setMasterAliasError, 
  selectRows, setMasterAliasErrorText, selectGeneralErrorText
} from './receivers-slice'
import { loggedIn } from './LoginUtil';
import NavBar from './NavBar';

import * as styles from './receivers.module.css'

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const Receivers = () => {
  const dispatch = useDispatch()
  const masterAlias = useSelector(selectMasterAlias)
  const rows = useSelector(selectRows)
  const disabledMaster = useSelector(selectDisabledMaster)
  const masterAliasError = useSelector(selectMasterAliasError)
  const masterAliasErrorText = useSelector(selectMasterAliasErrorText)
  const generalErrorText = useSelector(selectGeneralErrorText)
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    dispatch(fetchData())
  }, [])

  const onMasterAliasChanged = (event) => {
    const textboxVal = event.target.value
    dispatch(setMasterAliasError(false));
    dispatch(setMasterAliasErrorText(''));
    var email = `${textboxVal}${process.env.REACT_APP_EMAIL_DOMAIN}`;
    if (emailAddressAllowed(email) || textboxVal === '') {
      dispatch(setMasterAlias({alias: textboxVal}));
    }
    dispatch(setGeneralErrorText(''));
  }

  const aliasFoundSameUserId = () => {
    dispatch(setGeneralErrorText('You already have this alias!'))
  }

  const aliasFound = () => {
    dispatch(setGeneralErrorText('Alias already in use or is not accepted.'))
  }

  const submitForm = () => {
    if (masterAlias) {
      checkAlias(`${masterAlias.alias}${process.env.REACT_APP_EMAIL_DOMAIN}`, masterAlias.alias);
    } else {
      dispatch(setMasterAliasError(true));
      dispatch(setMasterAliasErrorText('Required'));
    }
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
        dispatch(setDisabledMaster(true))
        dispatch(fetchMasterAlias())
      } else {
        dispatch(setGeneralErrorText('alias was blacklisted, try another'))
      }
    }
  }

  const onToggleChanged = event => {
    const {aliasId, newStatus} = event.target.dataset
    dispatch(onToggleChange(aliasId, newStatus))
  }

  const content = () => {
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    return rows.map((row) => {
      return (
        <Grid container>
          <Grid item xs={10} md={5} style={{wordWrap: 'break-word'}}>{row.alias}</Grid>
          <Grid item xs={2} md={7}><CopiedTooltip alias={row.alias} /></Grid>
          <Grid item xs={10} md={5} style={{wordWrap: 'break-word'}}>
            {row.receiver}
          </Grid>
          <Grid item xs={2} md={7}>
            <ConfirmAliasDeletion aliasId={row.aliasId} alias={row.alias} />
          </Grid>
          <Grid item xs={10} md={5}>&nbsp;</Grid>
          <Grid item xs={2} md={7}>
            <Switch
              {...label}
              checked={row.status}
              inputProps={{
                'data-alias-id': row.aliasId, 
                'data-new-status': !row.status
              }}
              onChange={onToggleChanged}
              color="secondary"
            />
          </Grid>
        </Grid>
      )
    })
  }

  const openModalOnClick = () => {
    setOpenModal(true);
  }

  const closeModalOnClose = () => {
    setOpenModal(false);
  };

  const generateMasterAliasClicked = () => {
    dispatch(generateMasterAlias())
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loggedIn() && <NavBar />}
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body1"
          component="div"
          className={styles.grayFontDark}
        >
          Anonymously email anyone you want using receiver aliases:
          <ol>
            <li>Generate a one-time master alias and click CREATE</li>
            <li>Create a receiver alias by clicking + and filling out the form</li>
            <li>Copy the receiver alias and send an email</li>
          </ol>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
            variant="body1"
            component="div"
            className={styles.grayFontDark}
        >
          All messages will appear to be from your master alias.
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Hit ⟳ to generate"
          variant="outlined"
          fullwith="true"
          disabled={disabledMaster}
          onChange={onMasterAliasChanged}
          error={masterAliasError}
          helperText={masterAliasErrorText}
          value={masterAlias?.alias ? masterAlias.alias : ''}
          inputProps={{ maxLength: 30 }}
          InputProps={{
            startAdornment: <InputAdornment position="start" />,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={generateMasterAliasClicked} disabled={disabledMaster}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <div style={{ color: 'red', textAlign: "left" }}>
          {generalErrorText}
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
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
      <Grid item xs={12}>
        <IconButton>
          <AddIcon onClick={openModalOnClick} />
        </IconButton>
        Create Receiver Alias
      </Grid>
      <Grid item xs={12}>
        {content()}
        <Modal
          open={openModal}
          onClose={closeModalOnClose}
          sx={style}
        >
          <ReceiverForm handleCreateAliasModalClose={closeModalOnClose} />
        </Modal>
      </Grid>
    </Grid>
  );
}