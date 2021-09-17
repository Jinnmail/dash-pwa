import React, {Fragment, useEffect} from 'react';
import {Link, withRouter} from "react-router-dom";
import {Button, Grid} from '@material-ui/core';
import {CheckCircleOutline as CheckCircleOutlineIcon} from '@material-ui/icons';
import NumberFormat from 'react-number-format';
import { postVerify } from './verify-code-helper';

function VerifyCode(props) {
  const [showSuccessIcon, setShowSuccessIcon] = React.useState(false);
  let res;

  const verifyCodeChanged = async (event) => {
    const inputNumber = event.target.value.replace(/\s/g, '');
    if (Number(inputNumber)) {
      if (props.history.location.state.prevPath === '/signup') {
        res = await postVerify(localStorage.getItem('email'), inputNumber)
      } else {
        res = await fetch(`${process.env.REACT_APP_API}/user/code/resetPasswordTokenVerify`, {
          method: 'POST', 
          headers: {'Content-type': 'application/json'}, 
          body: JSON.stringify({email: localStorage.getItem('email'), token: inputNumber})
        })
      }
      const json = await res.json()
      if (!json.error) {
        setShowSuccessIcon(true)
        if (props.history.location.state.prevPath === '/forgot-password') {
          localStorage.setItem('resetPasswordToken', inputNumber)
          props.history.push(`/forgot-password-set`)
        } else if (props.history.location.state.prevPath === '/dashboard/change-password') {
          localStorage.setItem('resetPasswordToken', inputNumber)
          props.history.push(`/dashboard/change-password-set`)
        } else if (props.history.location.state.prevPath === '/signup') {
          props.history.push('/login')
        }
      }
    } else {
      setShowSuccessIcon(false)
    }
  }

  const onResendCodeClick = async (event) => {
    event.preventDefault()
    const res = await fetch(`${process.env.REACT_APP_API}/user/forgot/passwordResetPasswordToken`, {
      method: 'POST', 
      headers: {'Content-type': 'application/json'}, 
      body: JSON.stringify({email: localStorage.getItem('email')})
    })
  }

  return (
    <Grid 
      container
      direction="row"
      justify="center"
      alignItems="center">
      <Grid item xs={4}>
        <Button variant="outlined" color="primary" onClick={() => props.history.goBack()}>&lt; Back</Button>
      </Grid>
      <Grid item xs={4} style={{textAlign: 'center'}}>
        <h3>Verify email code</h3>
      </Grid>
      <Grid item xs={4}></Grid>
      {
        (props.history.location.state.prevPath === '/forgot-password') &&
          <Fragment>
            <Grid item xs={12} style={{textAlign: 'center'}}>
              If this account exists...
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
          </Fragment> 
      }
      <Grid item xs={12} style={{textAlign: 'center'}}>
        You should have recieved a code emailed to <br />
        [{localStorage.getItem('email')}]. Enter it below.
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={3} md={5}>&nbsp;</Grid>
      <Grid item xs={6} md={2} style={{textAlign: 'center'}}>
        <NumberFormat
          format="# # # # # #"
          allowEmptyFormatting
          mask="_"
          style={{
            height: '50px',
            width: "145px",
            fontSize: '20pt',
            textAlign: 'center'
          }}
          onChange={verifyCodeChanged}
          fullWidth
          data-testid="verify-code-input" 
        />
      </Grid>
      <Grid item xs={3} md={5}>
        &nbsp; {
          showSuccessIcon && 
          <CheckCircleOutlineIcon
            style={{
              color: 'green',
              verticalAlign: 'middle',
              width: 40,
              height: 40
            }}
            data-testid="green-success-icon"
          />
        }
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} style={{textAlign: 'center'}}>Not received? <small><a href="#" onClick={onResendCodeClick}>Resend code</a></small></Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      {((props.history.location.state.prevPath === '/forgot-password') || (props.history.location.state.prevPath === '/dashboard/change-password')) &&
        <Fragment>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            -- No account? --
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            <Link to="/signup" style={{textDecoration: 'none'}}><Button variant="outlined" color="primary">Create Account</Button></Link>
          </Grid>
        </Fragment>
      }
    </Grid>
  )
}

export default withRouter(VerifyCode);
