import React, { Fragment, useEffect } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { loggedIn } from './LoginUtil';
import NavBar from './NavBar';
import {Button, Grid, Hidden, IconButton, InputAdornment, TextField, Tooltip} from '@material-ui/core'
import {
  CheckCircleOutline as CheckCircleOutlineIcon, 
  MailOutline as MailOutlineIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon
} from '@material-ui/icons'

function Account(props) {
  const [user, setUser] = React.useState(null);
  const [allowedToSubmit, setAllowedToSubmit] = React.useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = React.useState(false);
  const [passwordErrorText, setPasswordErrorText] = React.useState('');
  const [values, setValues] = React.useState({
    password: '', 
    showPassword: false, 
    confirm: '', 
    showConfirm: false
  });
  const [confirmVerified, setConfirmedVerified] = React.useState();

  const location = {
    pathname: '/dashboard/change-password',
    state: {prevPath: '/account'}
  }

  useEffect(() => {
    const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
    fetchData(userId)
  }, [])

  const fetchData = async (userId) => {
    const res = await fetch(`${process.env.REACT_APP_API}/user/${userId}`, 
      {headers: {'Authorization': localStorage.getItem('jinnmailToken')}
    });
    const json = await res.json();
    setUser(json);
  }

  const onPasswordChanged = (prop) => async (event) => {
    event.preventDefault()
    const value = event.target.value;
    if (/(?=.{12,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])/.test(event.target.value)) {
      const res = await fetch(`${process.env.REACT_APP_API}/user/session`, {
        method: 'post', 
        headers: {'Content-type': 'application/json'}, 
        body: JSON.stringify({email: user.email, password: value})
      })
      const json = await res.json();
      if (!json.error) {
        setShowSuccessIcon(true);
        if (confirmVerified) {
          setAllowedToSubmit(true);
        } else {
          setAllowedToSubmit(false);
        }
      } else {
        setShowSuccessIcon(false);
        setAllowedToSubmit(false);
        setPasswordErrorText(json.error)
      }
    }  else {
      setAllowedToSubmit(false);
      setShowSuccessIcon(false);
    }
    setPasswordErrorText('');
    setValues({ ...values, [prop]: value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onConfirmChanged = (prop) => (event) => {
    if(/(?=.{12,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])/.test(event.target.value)) {
      setAllowedToSubmit(true);
      setConfirmedVerified(true);
    }  else {
      setConfirmedVerified(false);
      setAllowedToSubmit(false);
    }
    setPasswordErrorText('');
    setValues({ ...values, [prop]: event.target.value});
  };

  const handleClickShowConfirm = () => {
    setValues({ ...values, showConfirm: !values.showConfirm });
  };

  const handleMouseDownConfirm = (event) => {
    event.preventDefault();
  };

  const onSavePasswordClicked = async () => {
      const res = await fetch(`${process.env.REACT_APP_API}/user/forgot/password/resetNoResetPasswordToken`, {
        method: 'POST', 
        headers: {'Content-type': 'application/json'}, 
        body: JSON.stringify({email: user.email, password: values.confirm})
      })
      const json = await res.json();
      if (!json.error) {
        setPasswordErrorText('');
        setValues({...values, password: '', confirm: ''});
        setConfirmedVerified(false);
        setShowSuccessIcon(false);
        setAllowedToSubmit(false);
      } else {
        setPasswordErrorText(json.error)
      }
  }

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          {loggedIn() && <NavBar />}
        </Grid>
        <Grid item xs={12}>
          &nbsp;
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="primary" onClick={() => props.history.goBack()}>&lt; Back</Button>
        </Grid>
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <h2 style={{color: 'gray'}}>Preferences</h2>
        </Grid>
        <Grid item xs={12}>
          <div>
            <MailOutlineIcon style={{verticalAlign: 'middle', width: 20, height: 20}}></MailOutlineIcon> 
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
          <h3 style={{color: 'gray'}}>Account Email</h3>
        </Grid>
        <Hidden mdUp>
          <Grid item xs={12} style={{textAlign: 'left'}}>
            <b>All aliases will forward to this address.</b>
          </Grid>
          <Grid item xs={12}>
            {user && user.email}
          </Grid>
        </Hidden>
        <Hidden smDown>
          <Grid item xs={12} style={{textAlign: 'left'}}>
            &nbsp;&nbsp;&nbsp;<b style={{color: 'gray'}}>All aliases will forward to this address.</b>
          </Grid>
          <Grid item xs={12}>
            &nbsp;&nbsp;&nbsp;{user && user.email}
          </Grid>
        </Hidden>
        <Grid item xs={12}>
          <h3 style={{color: 'gray'}}>Change password</h3>
        </Grid>
        <Grid item xs={10} md={4}>
          <TextField 
            variant='outlined'
            label='Current Password'
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={onPasswordChanged('password')}
            fullWidth
            InputProps={{
              endAdornment: (
                <Fragment>
                  <InputAdornment position="end">
                    <Tooltip title="Show/Hide typing">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                    <InputAdornment position="end">
                      {showSuccessIcon
                        ?
                          <CheckCircleOutlineIcon style={{color: 'green'}}  />
                        :
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      }
                    </InputAdornment>
                </Fragment>
              )
            }}
          />
          <div style={{marginBottom: 5}}>
            <small>
              <Link to={location}>Forgot Password?</Link>
            </small>
          </div>
        </Grid>
        <Grid item xs={2} md={8}></Grid>
        <Hidden smDown>
          <Grid item xs={12}>&nbsp;</Grid>
        </Hidden>
        <Grid item xs={10} md={4}>
          <TextField 
            variant='outlined'
            label='New Password'
            type={values.showConfirm ? 'text' : 'password'}
            value={values.confirm}
            onChange={onConfirmChanged('confirm')}
            fullWidth
            error={passwordErrorText !== ''}
            helperText={passwordErrorText || "Min 12 chars. At least 1 number, 1 capital letter, and 1 symbol"}
            InputProps={{
              endAdornment: (
                <Fragment>
                  <InputAdornment position="end">
                    <Tooltip title="Show/Hide typing">
                      <IconButton
                        aria-label="toggle email visibility"
                        onClick={handleClickShowConfirm}
                        onMouseDown={handleMouseDownConfirm}
                        edge="end"
                      >
                        {values.showConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </Fragment>
              )
            }}
          />
        </Grid>
        <Grid item xs={2} md={8}></Grid>
        <Grid item xs={10} md={4} style={{textAlign: "right"}}>
          <Button variant="outlined" color="primary" onClick={onSavePasswordClicked} disabled={!allowedToSubmit}>Save new password</Button>
        </Grid>
        <Grid item xs={2} md={4}></Grid>
      </Grid>
    </Fragment>
  )
}

export default withRouter(Account);
