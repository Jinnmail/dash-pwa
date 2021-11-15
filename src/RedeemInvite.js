import React, { Fragment, useEffect } from 'react';
import {Link, withRouter} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import {
  Button,
  Divider,  
  Grid, 
  Hidden, 
  LinearProgress, 
  List, 
  ListItem, 
  TextField, 
} from '@material-ui/core';

/*global chrome*/

function RedeemInvite(props) {
  const [redeemCode, setRedeemCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [redeemTries, setRedeemTries] = React.useState(0);
  const [recaptcha, setRecaptcha] = React.useState(false);
  const [allowedToSubmit, setAllowedToSubmit] = React.useState(false);
  const [step, setStep] = React.useState(1);

  const [stepsEnabled, setStepsEnabled] = React.useState(false);
  const [initialStep, setInitialStep] = React.useState(0);
  const [steps, setSteps] = React.useState([{
    element: ".extBar", 
    intro: "Location of extension"
  }, {
    element: '.ext', 
    intro: "Example extension home screen"
  }]);
  const [hintsEnabled, setHintsEnabled] = React.useState(true);

  const [hasExtension, setHasExtension] = React.useState(false);

  let content;

  useEffect(() => {
    var url = new URL(window.location.href);
    var email = atob(url.searchParams.get("e"))
    setEmail(email)

    try {
      chrome.runtime.sendMessage(process.env.REACT_APP_JM_EXT_ID, { message: "version" },
        function (reply) {
          if (reply) {
            if (reply.version) {
              setHasExtension(true);
            }
          }
          else {
            setHasExtension(false);
          }
        }
      );
    } catch (error) { // chrome.runtime undefined on android chrome browser
      setHasExtension(false);
    }
  }, [])

  const onExit = () => {
    setStepsEnabled(false);
  }

  const toggleSteps = () => {
    setStepsEnabled(!stepsEnabled);
  }

  const toggleHints = () => {
    setHintsEnabled(!hintsEnabled);
  }

  const addStep = () => {
    const newStep = {element: ".alive", intro: 'Alive step'}
    setSteps(steps.concat(newStep));
  }

  const onRedeemChanged = (event) => {
    if (event.target.value.length === 6) {
      setRedeemCode(event.target.value)
      if (!recaptcha) {
        setAllowedToSubmit(true)
      }
      // setRecaptcha(true);
    } else {
      setRedeemCode('')
      // setRecaptcha(false);
      setAllowedToSubmit(false);
    }
  }

  const onRecaptchaSuccess = () => {
    setAllowedToSubmit(true)
  }

  const onRedeemClicked = async () => {    
    const res = await fetch(`${process.env.REACT_APP_API}/invite/redeem`, {
      method: 'POST', 
      headers: {'Content-type': 'application/json'}, 
      body: JSON.stringify({email: email, inviteCode: redeemCode})
    })
    const json = await res.json()
    if (!json.error) {
      setTimeout(() => {
        setStep(2);
        // props.history.push('/login')
      }, 1000)
    } else {
      setRedeemTries(redeemTries => redeemTries + 1);
      if (redeemTries >= 1 && process.env.NOD_ENV !== 'development') {
        setAllowedToSubmit(false);
        setRecaptcha(true);
      }
    }
  }

  if (step === 1) {
    content = 
      <Grid 
        container
        direction="row"
        justify="center"
        alignItems="stretch">
        <Grid item xs={4}>
          
        </Grid>
        <Grid item xs={4}>
          <h2 style={{textAlign: 'center', color: 'gray'}}>Got a Jinn-For-Life invite?</h2>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={10} md={4} style={{textAlign: "center"}}>If you received a Premium invite to our upgraded service, enter your invite code below.</Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={1} md={4}>

        </Grid>
        <Grid item xs={10} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Invite Code" variant="outlined" fullWidth onChange={onRedeemChanged} />
                {/* <TextField label="" variant="outlined" fullWidth onChange={onEmailChanged} /> */}
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
          <Button variant="outlined" color="primary" onClick={onRedeemClicked} disabled={!allowedToSubmit}>Redeem</Button>
          {/* <Button variant="contained" color="primary" onClick={onRequestCodeClicked} disabled={!allowedToSubmit}>Request code</Button> */}
        </Grid>
        <Grid item xs={1} md={4}>
          
        </Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        <Grid item xs={1} md={4}>
              
        </Grid>
        <Grid item xs={10} md={4} style={{textAlign: 'center'}}>
          -- No Premium invite? --
          <Grid container>
            <Grid item xs={3} md={4} />
            <Grid item xs={7} md={4} style={{textAlign: 'left'}}>
              <small>Ask around. <i>New Jinnmail Premium</i> users are given a handful of Jinn-For-Life invites to give out.</small>
            </Grid>
            <Grid item xs={2} md={4} />
          </Grid>
        </Grid>
        <Grid item xs={1} md={4}>
          
        </Grid>
      </Grid>
  } else {
    content =
      <Grid container>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={10} md={4} style={{textAlign: 'center'}}>
          <h2 style={{color: 'gray', marginBottom: "5px"}}>Camouflage your email address with Jinnmail.</h2>
          <small>Fight spam, hackers, and surveillance with secret temporary email aliases for every interaction. Keeping your address private and spam-free.</small>
        </Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={12}>&nbsp;</Grid>
        {hasExtension 
          ?
            <Fragment>
              <Steps
                enabled={stepsEnabled}
                steps={steps}
                initialStep={initialStep}
                onExit={onExit}  
              />
              <Grid item xs={1}></Grid>
              <Grid item xs={10} style={{textAlign: 'center'}}>
                <img className="extBar" src="extbar.png" alt="extbar" />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={12}>&nbsp;</Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={10} style={{textAlign: 'center'}}>
                <img className="ext" src="ext.png" alt="ext" />
              </Grid>
              <Grid item xs={1}></Grid> 
              <Grid item xs={12}>&nbsp;</Grid>
              <Grid item xs={1} md={4}></Grid>
              <Grid item xs={10} md={4} style={{textAlign: 'center'}}>
                <b>You can now use the extension!</b>
                <br />
                Go ahead. Give it a try.
                <br />
                <Button variant="outlined" color="primary" fullWidth onClick={toggleSteps}>Open Jinnmail extension?</Button>
              </Grid>
              <Grid item xs={1} md={4}></Grid>
            </Fragment>
          :
            <Fragment>
              <Grid item xs={12}>&nbsp;</Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <b>Get the extension</b>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <Button variant="outlined" color="primary" fullWidth onClick={() => {window.open("https://chrome.google.com/webstore/detail/jinnmail-%E2%80%94-privacy-for-yo/nbeghdcngabhmanlobkjlnahdlimiejg/", "_blank")}}>+ Get it for Chrome</Button>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <small>
                  Jinnmail can still be used without it, but the chrome extension
                  makes life SO MUCH EASIER.
                </small>
              </Grid>
              <Grid item xs={1}></Grid>
            </Fragment>
        }
        <Grid item xs={1}></Grid>
        <Grid item xs={10} style={{textAlign: 'center'}}>
          <List>
            <ListItem></ListItem>
            <Divider />
            <ListItem></ListItem>
          </List>
        </Grid>
        <Grid item xs={1}>
        
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={10} style={{textAlign: 'center'}}>
          <b>-- Login to your account --</b>
          <br />
          <small>If you received an invite to our upgraded service, Login here.</small>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={10} md={4} style={{textAlign: 'center'}}>
          <Button variant="outlined" color="primary" fullWidth>
            <Link to="/login" style={{textDecoration: 'none', color: "#3f51b5"}}>
              login
            </Link>
          </Button>
        </Grid>
        <Grid item xs={1} md={4}></Grid>
        <Grid item xs={1}>
        
        </Grid>
        <Grid item xs={10}>

        </Grid>
        <Grid item xs={1}>
        
        </Grid>
        {hasExtension &&
          <Fragment>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={1} md={4}>
            
            </Grid>
            <Grid item xs={10} md={4} style={{textAlign: 'center'}}>
              <b>-- Or manage your account --</b>
              <br />
              <small>View your account and manage your aliases.</small>
            </Grid>
            <Grid item xs={1} md={4}>
        
            </Grid>
            <Grid item xs={1}>
            
            </Grid>
            <Grid item xs={10}>
              
            </Grid>
            <Grid item xs={1}>
        
            </Grid>
            <Grid item xs={1} md={4}>
        
            </Grid>
            <Grid item xs={10} md={4}>
              <Button variant="contained" color="primary" fullWidth>
                <Link to="/dashboard" style={{textDecoration: 'none', color: "white"}}>
                  Account Dashboard
                </Link>
              </Button>
            </Grid>
            <Grid item xs={1} md={4}>
          
            </Grid>
          </Fragment>
        }
      </Grid>
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default withRouter(RedeemInvite);