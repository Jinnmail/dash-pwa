import React from 'react';
import {withRouter} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Button,
  Grid,
  Hidden,  
  IconButton, 
  InputAdornment, 
  TextField, 
  Tooltip, 
} from '@material-ui/core';
import {
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon, 
} from '@material-ui/icons';
import { postCreateUser } from './create-account-helper';

function Signup(props) {
  const [recaptcha, setRecaptcha] = React.useState(false);
  const [allowedToSubmit, setAllowedToSubmit] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailErrorText, setEmailErrorText] = React.useState('');
  const [values, setValues] = React.useState({
    password: '', 
    showPassword: false,
    passwordValid: false
  });

  const onEmailChanged = (prop) => (event) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(event.target.value)) {
      setEmail(event.target.value)
      setEmailErrorText('')
    } else {
      setEmail('')
    }
    setValues({ ...values, [prop]: event.target.value });
  }

  const onPasswordChanged = (prop) => (event) => {
    if(/(?=.{12,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])/.test(event.target.value)) {
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        setAllowedToSubmit(true);
      } else {
        setRecaptcha(true);
      }
    }  else {
      setRecaptcha(false);
      setAllowedToSubmit(false);
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onRecaptchaSuccess = (value) => { // only fires on success
    setAllowedToSubmit(true)
  }

  const onCreateAccountClick = async () => {
    if (!email) { // not a valid email address
      setEmailErrorText('Invalid Email')
    } else {
      if (allowedToSubmit) {
        const res = await postCreateUser(email, values.password);
        const json = await res.json();
        if (!json.error) {
          localStorage.setItem('email', email);
          const location = {
            pathname: '/verify-code',
            state: {prevPath: window.location.pathname}
          }
          props.history.push(location)
        } else {
          setEmailErrorText("Email Already Exists");
        }
      }
    }
  }

  return (
    <Grid container style={{textAlign: 'center'}} spacing={2}>
      <Grid item xs={1} md={4}>

      </Grid>
      <Grid item xs={10} md={4}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2 style={{textAlign: 'center', color: 'gray'}}>Jinnmail</h2> 
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email address"
                type="email"
                variant="outlined"
                fullWidth
                value={values.email}
                onChange={onEmailChanged('email')}
                error={emailErrorText !== ''}
                helperText={emailErrorText}
                inputProps={{
                  "data-testid": "email"
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                variant='outlined'
                label='Password'
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={onPasswordChanged('password')}
                fullWidth
                helperText=" chars. At least 1 number, 1 capital letter, and 1 symbol"
                InputProps={{
                  endAdornment: (
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
                  )
                }}
                inputProps={{
                  "data-testid": "password"
                }}
              />
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={1} md={4}>
              
      </Grid>
      <Grid item xs={1} md={4}>

      </Grid>
      <Grid item xs={11} md={2}>
        {
          recaptcha && (
            <ReCAPTCHA
              size="compact"
              sitekey="6LfoK8MZAAAAAAqzzkWscqJbD0fCizOs13IfOZu9"
              onChange={onRecaptchaSuccess}
            />
          )
        }
      </Grid>
      <Hidden mdUp>
        <Grid item xs={1}>
          
        </Grid>
      </Hidden>
      <Grid item xs={10} md={2} style={{textAlign: "right"}}>
        <Button 
          id="createAccount" 
          variant="outlined" 
          color="primary" 
          onClick={onCreateAccountClick} 
          disabled={!allowedToSubmit}
          data-testid="create-account"
        >
          Create Account
        </Button>
      </Grid>
      <Grid item xs={1} md={4}>
        
      </Grid>
      <Grid item xs={12}>
        &nbsp;
      </Grid>
      <Grid item xs={1} md={4}>
            
      </Grid>
      <Grid item xs={10} md={4}>
        -- Already have an account? ---
      </Grid>
      <Grid item xs={1} md={4}>
        
      </Grid>
      <Grid item xs={1} md={4}>
            
      </Grid>
      <Grid item xs={10} md={4}>
        <Button variant="contained" color="primary" onClick={() => {props.history.push('/login')}}>Log In</Button>
      </Grid>
      <Grid item xs={1} md={4}>
        
      </Grid>
    </Grid>
  )
}

export default withRouter(Signup);

// import React from 'react';
// import {Link, withRouter} from 'react-router-dom';

// const CreateAccount = (props) => {
//   const onCreateAccountClick = () => {
   
//   }

//   const onLoginClick = () => {
//     props.history.push('/login')
//   }

//   return (
//     <div>
//       <button onClick={onCreateAccountClick}>Create Account</button>
//       <button onClick={onLoginClick}>Login</button>
//     </div>
//   )
// }

// export default withRouter(CreateAccount);