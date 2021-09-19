import React, {Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { loggedIn } from './LoginUtil';
import NavBar from './NavBar';
import {Button, Hidden, Grid, TextField} from '@material-ui/core';
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPassword = (props) => {
  const [email, setEmail] = React.useState('');
  const [recaptcha, setRecaptcha] = React.useState(false);
  const [allowedToSubmit, setAllowedToSubmit] = React.useState(false)
  const [message, setMessage] = React.useState('');

  const onEmailChange = (event) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(event.target.value)) {
      setEmail(event.target.value)
      if (props.history.location.state.prevPath === '/login') {
        if (process.env.NODE_ENV === 'development') {
          setAllowedToSubmit(true);
        } else {
          setRecaptcha(true);
        }
      } else if (props.history.location.state.prevPath === '/account') {
        setAllowedToSubmit(true);
      }
    }
  }

  const onRecaptchaSuccess = () => {
    setAllowedToSubmit(true)
  }

  const onRequestCodeClick = async () => {
    if (allowedToSubmit) {
      const res = await fetch(`${process.env.REACT_APP_API}/user/forgot/passwordResetPasswordToken`, {
        method: 'POST', 
        headers: {'Content-type': 'application/json'}, 
        body: JSON.stringify({email: email})
      })
      const json = await res.json()
      if (!json.error) {
        setTimeout(() => {
          localStorage.setItem('email', email);
          const location = {
            pathname: '/verify-code',
            state: {prevPath: window.location.pathname}
          }
          props.history.push(location)
        }, 2000)
      }
      setMessage(`if ${email} matches your account, you will receive a verification code to reset your password.`);
      setAllowedToSubmit(false);
    }
  }

  return (
    <Fragment>
      <Grid 
        container
        // direction="row"
        // justify="center"
        // alignItems="stretch"
      >
        <Grid item xs={12}>
          {loggedIn() && <NavBar />}
        </Grid>
        <Grid item xs={12}>
          &nbsp;
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="primary" onClick={() => props.history.goBack()}>&lt; Back</Button>
        </Grid>
        <Grid item xs={12}>
          <h2 style={{textAlign: 'center', color: 'gray'}}>Change password.</h2>
        </Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={10} md={4} style={{textAlign: "center"}}>Receive verification code by entering your email address registered on your Jinnmail account</Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={1} md={4}>

        </Grid>
        <Grid item xs={10} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="" variant="outlined" fullWidth onChange={onEmailChange} />
              </Grid>
            </Grid>
        </Grid>
        <Grid item xs={1} md={4}>
                
        </Grid>
        <Grid item xs={12}>
          &nbsp;
        </Grid>
        <Grid item xs={1} md={4}>

        </Grid>
        <Grid item xs={11} md={2}>
          {
            recaptcha && 
            <ReCAPTCHA
              size="compact"
              sitekey="6LfoK8MZAAAAAAqzzkWscqJbD0fCizOs13IfOZu9"
              onChange={onRecaptchaSuccess}
            />
          }
        </Grid>
        <Hidden mdUp>
          <Grid item xs={1}>
            
          </Grid>
        </Hidden>
        <Grid item xs={10} md={2} style={{textAlign: "right"}}>
          <Button variant="contained" color="primary" onClick={onRequestCodeClick} disabled={!allowedToSubmit}>Request code</Button>
        </Grid>
        <Grid item xs={1} md={4}>
          
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={10} md={4}>
          {message && 
            <div style={{border: "1px solid #D0D0D0"}}>
              {message}
            </div>
          }
        </Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={1} md={4}>
              
        </Grid>
        <Grid item xs={10} md={4}>
          <p style={{textAlign: 'center'}}>-- No Account? --</p>
        </Grid>
        <Grid item xs={1} md={4}>
          
        </Grid>
        <Grid item xs={1} md={4}>
              
        </Grid>
        <Grid item xs={10} md={4}>
          <Link to="/signup" style={{textDecoration: 'none'}}>
            <Button variant="outlined" color="primary" fullWidth>Create Account</Button>
          </Link>
        </Grid>
        <Grid item xs={1} md={4}>
          
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default withRouter(ForgotPassword);