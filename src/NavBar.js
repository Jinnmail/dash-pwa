import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {Button} from '@material-ui/core';

import { logOut } from './LoginUtil';

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

  const currPage = (path) => {
    return props.history.location.pathname === path;
  }

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
    logOut();
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
                      <MenuItem style={{ color: currPage('/dashboard') ? '#d2576b' : 'black'}} isCurrentPage={true} onClick={() => {props.history.push('/dashboard')}}>Dashboard</MenuItem>
                      <MenuItem style={{ color: currPage('/receivers') ? '#d2576b' : 'black' }} onClick={() => {props.history.push('/receivers')}}>Receivers</MenuItem>
                      <MenuItem style={{ color: currPage('/account') ? '#d2576b' : 'black' }} onClick={() => { props.history.push('/account') }}>My account</MenuItem>
                      <MenuItem onClick={onLogOutClick}>Log Out</MenuItem>
                    </Menu>
                  </Fragment>
                :
                  <div className={classes.headerOptions}>
                    <Button style={{color: currPage('/dashboard') ? "#dec800" : "inherit"}} onClick={() => props.history.push('/dashboard')}>Dashboard</Button>
                    <Button style={{color: currPage('/receivers') ? "#dec800" : "inherit"}} onClick={() => {props.history.push('/receivers') }}>Receivers</Button>
                  <Button style={{ color: currPage('/account') ? "#dec800" : "inherit" }} onClick={() => { props.history.push('/account') }}>My Account</Button>
                    <Button color="inherit" onClick={onLogOutClick}>Log Out</Button>
                  </div>
              }
            </div>
          )}
        </Toolbar>
      </AppBar>
      <br />
      {/* <div>
        <a href="" onClick={onLogOutClick}><small>LOG OUT</small></a>
      </div> */}
      <svg width="287" height="84" viewBox="0 0 287 84" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="287" height="84" fill="white"/>
        <mask id="path-1-inside-1_34:3046" fill="white">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M57.0338 28.407L57.0347 30.5929H60.0768H63.1188V43.4778V56.3628H60.0768H57.0347V58.5487V60.7345H65.2249H73.415V58.5487V56.3628H70.6069H67.7989V46.2131V36.063L69.2652 34.7464C71.5617 32.6839 76.2076 30.5754 79.1032 30.2818C81.5087 30.0374 81.8087 30.1189 83.2876 31.4175L84.8812 32.8169L85.0206 44.5896L85.1601 56.3628H82.0956H79.0311V58.5487V60.7345H87.2212H95.4113V58.5487V56.3628H92.6244H89.8374L89.6993 43.7862L89.5612 31.2095L88.2471 29.5165C86.1471 26.8107 83.7687 25.8687 79.544 26.0679C75.9024 26.2396 73.4655 27.096 69.9564 29.4378C69.0691 30.0301 68.2206 30.3941 68.0708 30.2468C67.9215 30.0996 67.7989 29.1981 67.7989 28.2432V26.5069L62.4159 26.3643L57.0329 26.2212L57.0338 28.407ZM116.94 27.0559C115.524 27.6293 113.523 28.6638 112.494 29.3545L110.622 30.6108L110.479 28.5308L110.336 26.4513H104.746H99.1554V28.5221V30.5929H102.431H105.707V43.4778V56.3628H102.431H99.1554V58.4134V60.4644L107.58 60.5992L116.005 60.7345L116.004 58.5487L116.004 56.3628H113.196H110.388V46.0116V35.6608L112.377 34.2191C116.902 30.9389 122.373 29.3987 124.896 30.695C127.417 31.99 127.702 33.4869 127.703 45.4336L127.704 56.3628H124.662H121.62L121.619 58.5487L121.619 60.7345L129.809 60.5987L138 60.4635V58.4129V56.3628H135.192H132.384L132.374 44.5132C132.365 34.0028 132.266 32.4557 131.504 30.823C131.031 29.8106 130.238 28.6279 129.742 28.1944C126.989 25.7914 121.308 25.2861 116.94 27.0559ZM14.4461 28.5221V30.5929H17.4881H20.5302L20.5231 48.6548C20.5157 68.3813 20.5391 68.2 17.7633 70.0393C16.5119 70.8685 15.5314 71.0885 13.0898 71.088L10 71.0876L10.0576 73.0438L10.1151 75L14.2696 74.9908C17.8087 74.983 18.7335 74.8127 20.5119 73.8404C23.0504 72.4529 24.5068 70.4314 25.1751 67.3675C25.4831 65.9552 25.6782 58.3807 25.6782 47.827V30.5929H28.7203H31.7623V28.5221V26.4513H23.1042H14.4461V28.5221ZM36.4424 28.5221V30.5929H39.4845H42.5265V43.4778V56.3628H39.4845H36.4424V58.4336V60.5044H44.8665H53.2907V58.4336V56.3628H50.2486H47.2066V41.407V26.4513H41.8245H36.4424V28.5221Z"/>
        </mask>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M57.0338 28.407L57.0347 30.5929H60.0768H63.1188V43.4778V56.3628H60.0768H57.0347V58.5487V60.7345H65.2249H73.415V58.5487V56.3628H70.6069H67.7989V46.2131V36.063L69.2652 34.7464C71.5617 32.6839 76.2076 30.5754 79.1032 30.2818C81.5087 30.0374 81.8087 30.1189 83.2876 31.4175L84.8812 32.8169L85.0206 44.5896L85.1601 56.3628H82.0956H79.0311V58.5487V60.7345H87.2212H95.4113V58.5487V56.3628H92.6244H89.8374L89.6993 43.7862L89.5612 31.2095L88.2471 29.5165C86.1471 26.8107 83.7687 25.8687 79.544 26.0679C75.9024 26.2396 73.4655 27.096 69.9564 29.4378C69.0691 30.0301 68.2206 30.3941 68.0708 30.2468C67.9215 30.0996 67.7989 29.1981 67.7989 28.2432V26.5069L62.4159 26.3643L57.0329 26.2212L57.0338 28.407ZM116.94 27.0559C115.524 27.6293 113.523 28.6638 112.494 29.3545L110.622 30.6108L110.479 28.5308L110.336 26.4513H104.746H99.1554V28.5221V30.5929H102.431H105.707V43.4778V56.3628H102.431H99.1554V58.4134V60.4644L107.58 60.5992L116.005 60.7345L116.004 58.5487L116.004 56.3628H113.196H110.388V46.0116V35.6608L112.377 34.2191C116.902 30.9389 122.373 29.3987 124.896 30.695C127.417 31.99 127.702 33.4869 127.703 45.4336L127.704 56.3628H124.662H121.62L121.619 58.5487L121.619 60.7345L129.809 60.5987L138 60.4635V58.4129V56.3628H135.192H132.384L132.374 44.5132C132.365 34.0028 132.266 32.4557 131.504 30.823C131.031 29.8106 130.238 28.6279 129.742 28.1944C126.989 25.7914 121.308 25.2861 116.94 27.0559ZM14.4461 28.5221V30.5929H17.4881H20.5302L20.5231 48.6548C20.5157 68.3813 20.5391 68.2 17.7633 70.0393C16.5119 70.8685 15.5314 71.0885 13.0898 71.088L10 71.0876L10.0576 73.0438L10.1151 75L14.2696 74.9908C17.8087 74.983 18.7335 74.8127 20.5119 73.8404C23.0504 72.4529 24.5068 70.4314 25.1751 67.3675C25.4831 65.9552 25.6782 58.3807 25.6782 47.827V30.5929H28.7203H31.7623V28.5221V26.4513H23.1042H14.4461V28.5221ZM36.4424 28.5221V30.5929H39.4845H42.5265V43.4778V56.3628H39.4845H36.4424V58.4336V60.5044H44.8665H53.2907V58.4336V56.3628H50.2486H47.2066V41.407V26.4513H41.8245H36.4424V28.5221Z" fill="#F8F0AF" stroke="#A6A067" stroke-width="2" mask="url(#path-1-inside-1_34:3046)"/>
        <mask id="path-2-inside-2_34:3046" fill="white">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M245.087 11.0782C243.681 12.6124 243.774 14.8219 245.297 16.0497C245.96 16.5837 246.857 17.0208 247.292 17.0208C248.842 17.0208 250.492 15.1915 250.492 13.4733C250.492 10.3166 247.145 8.83352 245.087 11.0782ZM260.089 13.0391V15.147H263.06H266.031V35.758V56.3689H263.06H260.089V58.4769V60.5848H268.545H277V58.4769V56.3689H274.029H271.058V33.65V10.9312H265.574H260.089V13.0391ZM214.842 24.9682C210.5 25.801 208.078 27.344 206.104 30.5345C205.38 31.7047 204.787 32.8219 204.787 33.0172C204.787 33.3278 208.094 34.4932 208.208 34.2229C208.762 32.9132 211.234 30.3603 212.68 29.6042C215.093 28.3427 220.633 28.1863 223.148 29.3091C225.806 30.4961 226.443 31.9398 226.651 37.2392C226.751 39.7738 226.749 41.8476 226.649 41.8476C226.548 41.8476 225.238 41.382 223.739 40.8128C219.826 39.3274 214.136 39.348 210.847 40.8592C208.061 42.139 205.593 44.7322 204.791 47.2228C204.481 48.1855 204.315 50.217 204.423 51.7366C204.683 55.4297 206.402 57.9995 209.818 59.8021C212.069 60.9905 212.686 61.1076 215.796 60.938C218.808 60.7736 219.729 60.4916 222.801 58.7931C224.747 57.7176 226.426 56.8374 226.532 56.8374C226.639 56.8374 226.725 57.6805 226.725 58.7111V60.5848H231.753H236.78V58.4769V56.3689H234.038H231.296L231.261 44.5411C231.238 36.6105 231.046 32.2026 230.679 31.1641C229.877 28.8964 227.402 26.5374 224.969 25.7237C222.255 24.8154 217.49 24.4599 214.842 24.9682ZM164.111 25.4989C161.541 25.8877 159.141 26.9042 156.534 28.7067L154.513 30.105V28.013V25.9209H149.257H144.001V28.0289V30.1368H146.972H149.942V43.2529V56.3689H146.972H144.001L144 58.594L144 60.819L151.999 60.6808L159.997 60.5431V58.4558V56.3689H157.255H154.513V45.9075V35.4465L156.342 33.9395C162.272 29.0552 168.705 28.3067 170.337 32.3103C170.812 33.4758 170.966 36.6082 170.966 45.0891V56.3244L168.11 56.4636L165.253 56.6032V58.594C165.253 59.6892 165.407 60.5848 165.596 60.5848C165.785 60.5848 169.332 60.5848 173.48 60.5848H181.021V58.4769V56.3689H178.279H175.537V45.8321V35.2956L177.479 33.8435C181.304 30.9847 183.775 29.9569 186.887 29.9288C189.508 29.9049 189.887 30.0272 190.886 31.217L191.99 32.5314V44.4502V56.3689H189.248H186.506V58.594V60.819H194.275H202.045V58.594V56.3689H199.571H197.096L196.943 44.0726C196.791 31.9496 196.773 31.7468 195.641 29.6745C192.661 24.2191 185.229 23.8613 177.754 28.813C176.177 29.8581 174.813 30.4886 174.724 30.2141C174.635 29.9401 174.146 29.1737 173.638 28.5114C171.783 26.0952 168.024 24.9063 164.111 25.4989ZM240.167 26.0952C240.029 26.4657 239.981 27.4738 240.062 28.3357L240.208 29.9026L243.065 30.0422L245.921 30.1813V43.2754V56.3689H242.95H239.98V58.4769V60.5848H248.206H256.433V58.4994V56.4134L253.577 56.2743L250.72 56.1347L250.615 40.9107L250.511 25.6867L245.465 25.5542C241.412 25.4478 240.37 25.5542 240.167 26.0952ZM223.983 45.0699L226.497 46.2977V49.3425V52.3873L223.652 54.342C217.401 58.6366 210.999 57.9513 209.343 52.8098C208.384 49.8306 209.893 46.1426 212.721 44.5561C215.454 43.0224 220.238 43.2407 223.983 45.0699Z"/>
        <path d="M245.297 16.0497C243.774 14.8219 243.681 12.6124 245.087 11.0782C247.145 8.83352 250.492 10.3166 250.492 13.4733C250.492 15.1915 248.842 17.0208 247.292 17.0208C246.857 17.0208 245.96 16.5837 245.297 16.0497Z"/>
        </mask>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M245.087 11.0782C243.681 12.6124 243.774 14.8219 245.297 16.0497C245.96 16.5837 246.857 17.0208 247.292 17.0208C248.842 17.0208 250.492 15.1915 250.492 13.4733C250.492 10.3166 247.145 8.83352 245.087 11.0782ZM260.089 13.0391V15.147H263.06H266.031V35.758V56.3689H263.06H260.089V58.4769V60.5848H268.545H277V58.4769V56.3689H274.029H271.058V33.65V10.9312H265.574H260.089V13.0391ZM214.842 24.9682C210.5 25.801 208.078 27.344 206.104 30.5345C205.38 31.7047 204.787 32.8219 204.787 33.0172C204.787 33.3278 208.094 34.4932 208.208 34.2229C208.762 32.9132 211.234 30.3603 212.68 29.6042C215.093 28.3427 220.633 28.1863 223.148 29.3091C225.806 30.4961 226.443 31.9398 226.651 37.2392C226.751 39.7738 226.749 41.8476 226.649 41.8476C226.548 41.8476 225.238 41.382 223.739 40.8128C219.826 39.3274 214.136 39.348 210.847 40.8592C208.061 42.139 205.593 44.7322 204.791 47.2228C204.481 48.1855 204.315 50.217 204.423 51.7366C204.683 55.4297 206.402 57.9995 209.818 59.8021C212.069 60.9905 212.686 61.1076 215.796 60.938C218.808 60.7736 219.729 60.4916 222.801 58.7931C224.747 57.7176 226.426 56.8374 226.532 56.8374C226.639 56.8374 226.725 57.6805 226.725 58.7111V60.5848H231.753H236.78V58.4769V56.3689H234.038H231.296L231.261 44.5411C231.238 36.6105 231.046 32.2026 230.679 31.1641C229.877 28.8964 227.402 26.5374 224.969 25.7237C222.255 24.8154 217.49 24.4599 214.842 24.9682ZM164.111 25.4989C161.541 25.8877 159.141 26.9042 156.534 28.7067L154.513 30.105V28.013V25.9209H149.257H144.001V28.0289V30.1368H146.972H149.942V43.2529V56.3689H146.972H144.001L144 58.594L144 60.819L151.999 60.6808L159.997 60.5431V58.4558V56.3689H157.255H154.513V45.9075V35.4465L156.342 33.9395C162.272 29.0552 168.705 28.3067 170.337 32.3103C170.812 33.4758 170.966 36.6082 170.966 45.0891V56.3244L168.11 56.4636L165.253 56.6032V58.594C165.253 59.6892 165.407 60.5848 165.596 60.5848C165.785 60.5848 169.332 60.5848 173.48 60.5848H181.021V58.4769V56.3689H178.279H175.537V45.8321V35.2956L177.479 33.8435C181.304 30.9847 183.775 29.9569 186.887 29.9288C189.508 29.9049 189.887 30.0272 190.886 31.217L191.99 32.5314V44.4502V56.3689H189.248H186.506V58.594V60.819H194.275H202.045V58.594V56.3689H199.571H197.096L196.943 44.0726C196.791 31.9496 196.773 31.7468 195.641 29.6745C192.661 24.2191 185.229 23.8613 177.754 28.813C176.177 29.8581 174.813 30.4886 174.724 30.2141C174.635 29.9401 174.146 29.1737 173.638 28.5114C171.783 26.0952 168.024 24.9063 164.111 25.4989ZM240.167 26.0952C240.029 26.4657 239.981 27.4738 240.062 28.3357L240.208 29.9026L243.065 30.0422L245.921 30.1813V43.2754V56.3689H242.95H239.98V58.4769V60.5848H248.206H256.433V58.4994V56.4134L253.577 56.2743L250.72 56.1347L250.615 40.9107L250.511 25.6867L245.465 25.5542C241.412 25.4478 240.37 25.5542 240.167 26.0952ZM223.983 45.0699L226.497 46.2977V49.3425V52.3873L223.652 54.342C217.401 58.6366 210.999 57.9513 209.343 52.8098C208.384 49.8306 209.893 46.1426 212.721 44.5561C215.454 43.0224 220.238 43.2407 223.983 45.0699Z" fill="#DFD024"/>
        <path d="M245.297 16.0497C243.774 14.8219 243.681 12.6124 245.087 11.0782C247.145 8.83352 250.492 10.3166 250.492 13.4733C250.492 15.1915 248.842 17.0208 247.292 17.0208C246.857 17.0208 245.96 16.5837 245.297 16.0497Z" fill="#DFD024"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M245.087 11.0782C243.681 12.6124 243.774 14.8219 245.297 16.0497C245.96 16.5837 246.857 17.0208 247.292 17.0208C248.842 17.0208 250.492 15.1915 250.492 13.4733C250.492 10.3166 247.145 8.83352 245.087 11.0782ZM260.089 13.0391V15.147H263.06H266.031V35.758V56.3689H263.06H260.089V58.4769V60.5848H268.545H277V58.4769V56.3689H274.029H271.058V33.65V10.9312H265.574H260.089V13.0391ZM214.842 24.9682C210.5 25.801 208.078 27.344 206.104 30.5345C205.38 31.7047 204.787 32.8219 204.787 33.0172C204.787 33.3278 208.094 34.4932 208.208 34.2229C208.762 32.9132 211.234 30.3603 212.68 29.6042C215.093 28.3427 220.633 28.1863 223.148 29.3091C225.806 30.4961 226.443 31.9398 226.651 37.2392C226.751 39.7738 226.749 41.8476 226.649 41.8476C226.548 41.8476 225.238 41.382 223.739 40.8128C219.826 39.3274 214.136 39.348 210.847 40.8592C208.061 42.139 205.593 44.7322 204.791 47.2228C204.481 48.1855 204.315 50.217 204.423 51.7366C204.683 55.4297 206.402 57.9995 209.818 59.8021C212.069 60.9905 212.686 61.1076 215.796 60.938C218.808 60.7736 219.729 60.4916 222.801 58.7931C224.747 57.7176 226.426 56.8374 226.532 56.8374C226.639 56.8374 226.725 57.6805 226.725 58.7111V60.5848H231.753H236.78V58.4769V56.3689H234.038H231.296L231.261 44.5411C231.238 36.6105 231.046 32.2026 230.679 31.1641C229.877 28.8964 227.402 26.5374 224.969 25.7237C222.255 24.8154 217.49 24.4599 214.842 24.9682ZM164.111 25.4989C161.541 25.8877 159.141 26.9042 156.534 28.7067L154.513 30.105V28.013V25.9209H149.257H144.001V28.0289V30.1368H146.972H149.942V43.2529V56.3689H146.972H144.001L144 58.594L144 60.819L151.999 60.6808L159.997 60.5431V58.4558V56.3689H157.255H154.513V45.9075V35.4465L156.342 33.9395C162.272 29.0552 168.705 28.3067 170.337 32.3103C170.812 33.4758 170.966 36.6082 170.966 45.0891V56.3244L168.11 56.4636L165.253 56.6032V58.594C165.253 59.6892 165.407 60.5848 165.596 60.5848C165.785 60.5848 169.332 60.5848 173.48 60.5848H181.021V58.4769V56.3689H178.279H175.537V45.8321V35.2956L177.479 33.8435C181.304 30.9847 183.775 29.9569 186.887 29.9288C189.508 29.9049 189.887 30.0272 190.886 31.217L191.99 32.5314V44.4502V56.3689H189.248H186.506V58.594V60.819H194.275H202.045V58.594V56.3689H199.571H197.096L196.943 44.0726C196.791 31.9496 196.773 31.7468 195.641 29.6745C192.661 24.2191 185.229 23.8613 177.754 28.813C176.177 29.8581 174.813 30.4886 174.724 30.2141C174.635 29.9401 174.146 29.1737 173.638 28.5114C171.783 26.0952 168.024 24.9063 164.111 25.4989ZM240.167 26.0952C240.029 26.4657 239.981 27.4738 240.062 28.3357L240.208 29.9026L243.065 30.0422L245.921 30.1813V43.2754V56.3689H242.95H239.98V58.4769V60.5848H248.206H256.433V58.4994V56.4134L253.577 56.2743L250.72 56.1347L250.615 40.9107L250.511 25.6867L245.465 25.5542C241.412 25.4478 240.37 25.5542 240.167 26.0952ZM223.983 45.0699L226.497 46.2977V49.3425V52.3873L223.652 54.342C217.401 58.6366 210.999 57.9513 209.343 52.8098C208.384 49.8306 209.893 46.1426 212.721 44.5561C215.454 43.0224 220.238 43.2407 223.983 45.0699Z" stroke="#93907D" stroke-width="2" mask="url(#path-2-inside-2_34:3046)"/>
        <path d="M245.297 16.0497C243.774 14.8219 243.681 12.6124 245.087 11.0782C247.145 8.83352 250.492 10.3166 250.492 13.4733C250.492 15.1915 248.842 17.0208 247.292 17.0208C246.857 17.0208 245.96 16.5837 245.297 16.0497Z" stroke="#93907D" stroke-width="2" mask="url(#path-2-inside-2_34:3046)"/>
        <path d="M42.2695 15.9719L42.2695 15.9718C40.796 14.7843 40.6985 12.6422 42.0698 11.1458C43.07 10.0548 44.3754 9.87443 45.4298 10.3417C46.4857 10.8095 47.301 11.9323 47.301 13.4733C47.301 14.3021 46.9019 15.166 46.3081 15.8244C45.7135 16.4837 44.9386 16.9208 44.2017 16.9208C44.0084 16.9208 43.6927 16.8206 43.3332 16.6456C42.978 16.4727 42.5944 16.2339 42.2695 15.9719Z" fill="#F8F0AF" stroke="black" stroke-width="0.2"/>
      </svg>
    </div>
  );
}


export default withRouter(NavBar);