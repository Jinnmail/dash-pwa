import React, {Fragment, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Grid, IconButton, InputAdornment, TextField} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {fetchUser, fetchUserInvitesArr} from './userAliasesSlice';
import {useSelector, useDispatch} from 'react-redux';
import { loggedIn } from './LoginUtil';
import NavBar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function ManageInvites(props) {
  const [email, setEmail] = React.useState('');
  const [emailErrorText, setEmailErrorText] = React.useState('');

  const dispatch = useDispatch();

  const user = useSelector((state) => state.userAliases.user);
  const userInvitesArr = useSelector((state) => state.userAliases.userInvitesArr);

  useEffect(() => {
    const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
    dispatch(fetchUser(userId))
    dispatch(fetchUserInvitesArr(userId));
  }, [])

  const onEmailChange = (textBoxValue) => {
    setEmailErrorText('')
    setEmail(textBoxValue)
  }

  const onInviteClick = async () => {
    if (email.includes('@')) {
      const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
      const res = await fetch(`${process.env.REACT_APP_API}/invite`, {
        method: 'POST', 
        headers: {
          'Content-type': 'application/json', 
          'Authorization': localStorage.getItem('jinnmailToken')
        }, 
        body: JSON.stringify({userId: userId, email: email})
      })
      const json = await res.json()
      if (!json.error) {
        document.getElementById('email').value = '';
        setEmail('')
        setEmailErrorText('')
        dispatch(fetchUser(userId))
        dispatch(fetchUserInvitesArr(userId))
      } else {
        setEmailErrorText(json.error.message);
      }
    } else {
      setEmailErrorText('Incorrect entry.')
    }
  }

  const onCopyClick = async (email, inviteCode) => {
    const e = Buffer.from(email).toString('base64')
    const str = `Go to ${process.env.REACT_APP_DASHBOARD_URL}/redeem-invite?e=${e} and enter your invite code ${inviteCode} to get free Jinnmail for Life.`
    var aux = document.createElement("input");
    aux.setAttribute("value", str);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loggedIn() && <NavBar />}
        </Grid>
        <Grid item xs={12}>
          &nbsp;
        </Grid>
        <Grid item xs={12}>
          <small>{user && user.invites} Premium Invites Remaining</small>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={10} md={4}>
              <TextField
                label="Email"
                variant="outlined"
                id="email"
                label="Email" 
                type="email"
                fullWidth
                error={emailErrorText !== ''}
                helperText={emailErrorText}
                onChange={e => onEmailChange(e.target.value)} 
                InputProps={{
                  startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={2} md={8}>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={10} md={4}>
              <Button fullWidth variant="contained" color='primary' onClick={onInviteClick}>Invite</Button>
            </Grid>
            <Grid item xs={2} md={8}>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Email Sent</TableCell>
                  <TableCell>Copy Invite with Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userInvitesArr.map(userInvite => (
                  <TableRow>
                    <TableCell>
                      {userInvite.email}
                    </TableCell>
                    <TableCell >
                      <IconButton onClick={() => onCopyClick(userInvite.email, userInvite.inviteCode)}><AssignmentIcon></AssignmentIcon></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item md={6}></Grid>
      </Grid>
    </Fragment>
  )
}

export default withRouter(ManageInvites);

    {/* <div style={{border: "1px solid black", height: '90%'}}>Manage Invites</div> */}