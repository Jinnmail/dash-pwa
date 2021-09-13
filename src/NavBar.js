import React, {Fragment} from 'react';
import {LoginUtil} from './LoginUtil';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {Button} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    paddingRight: '20px', 
    [theme.breakpoints.down('xs')]: {
      flexGrow: 1, 
    }
  },
  headerOptions: {
    display: "flex", 
    flex: 1, 
    justifyContent: 'space-evenly'
  }
}));

const NavBar = (props) => {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOutClick = () => {
    LoginUtil.logOut();
    props.history.push('/login');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar style={{paddingRight: "0px"}}>
          <Typography variant="h6" className={classes.title}>
            Jinnmail
          </Typography>
          {auth && (
            <div>
              {mobile 
                ?
                  <Fragment>
                    <IconButton 
                      edge="start" 
                      className={classes.menuButton} 
                      color="inherit" 
                      aria-label="menu"
                      style={{marginRight: "0px"}}
                    >
                      <MenuIcon onClick={handleMenu} />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => {props.history.push('/dashboard')}}>Dashboard</MenuItem>
                      <MenuItem onClick={() => {props.history.push('/account')}}>My account</MenuItem>
                      <MenuItem onClick={onLogOutClick}>Log Out</MenuItem>
                    </Menu>
                  </Fragment>
                :
                  <div className={classes.headerOptions}>
                    <Button color="inherit" onClick={() => props.history.push('/dashboard')}>Dashboard</Button>
                    <Button color="inherit" onClick={() => {props.history.push('/account')}}>My Account</Button>
                    {/* <Button color="inherit" onClick={() => { props.history.push('/contact') }}>Contact</Button> */}
                    <Button color="inherit" onClick={onLogOutClick}>Log Out</Button>
                  </div>
              }
            </div>
          )}
        </Toolbar>
      </AppBar>
      <br />
      <img src="logo.png" alt="logo" width="250" height="62" />
    </div>
  );
}


export default withRouter(NavBar);