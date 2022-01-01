import React, { Component, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import CreateAccount from './CreateAccount';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import TransitionToLogin from './TransitionToLogin';
import Account from './Account';
import { loggedIn } from './LoginUtil';
import VerifyCode from './VerifyCode';
import ForgotPasswordSet from './ForgotPasswordSet';
import ManageInvites from './ManageInvites';
import RedeemInvite from './RedeemInvite';
import Checkout from './Checkout';
import Canceled from './Canceled';
import Success from './Success';
import X from './X';
import { getUserId, getUser } from './app-helper';
import Receivers from './Receivers';
import CacheBuster from './cache-buster';

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function PrivateRoute2({ children, ...rest }) {
  const [loaded, setLoaded] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  async function fetchPaid() {
    if (localStorage.getItem('jinnmailToken')) {
      const userId = getUserId();
      try {
        const res = await getUser(userId)
        const json = await res.json();
        setPaid(json.premium);
        localStorage.setItem('paid', json.premium)
      } catch (err) {
        setPaid(localStorage.getItem('paid'))
      };
    }
    setLoaded(true);
  }

  useEffect(() => {
    fetchPaid()
  }, [])

  if (loaded) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          paid ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/checkout",
                state: { from: location }
              }}
            />
          )
        }
      />
    )
  } else {
    return null;
  }
}

class App extends Component {
  render() {
    return (
      <CacheBuster>
        {({ loading, isLatestVersion, refreshCacheAndReload }) => {
          if (loading) return null;
          if (!loading && !isLatestVersion) {
            refreshCacheAndReload();
          }

          return (
            <Router>
              <Switch>
                <Route exact path={["/forgot-password", "/dashboard/change-password"]}>
                  <ForgotPassword />
                </Route>
                <Route exact path={["/forgot-password-set", "/dashboard/change-password-set"]}>
                  <ForgotPasswordSet />
                </Route>
                <Route exact path="/account/x/:token">
                  <X />
                </Route>
                <Route exact path='/account/login'> {/* ext still tries to login to /account/login NOT login */}
                  {loggedIn() 
                    ? <Redirect to='/dashboard' /> 
                    : <TransitionToLogin />
                  }
                </Route>
                <PrivateRoute2 path='/account'>
                  <Account /> 
                </PrivateRoute2>
                <Route path="/verify-code">
                  <VerifyCode />
                </Route>
                <PrivateRoute2 exact path="/dashboard">
                  <Dashboard />
                </PrivateRoute2>
                <PrivateRoute2 exact path='/invites'>
                  <ManageInvites /> 
                </PrivateRoute2>
                <Route path="/login">
                  <TransitionToLogin />
                </Route>
                <Route path="/signup">
                  <CreateAccount />
                </Route>
                <Route path="/redeem-invite">
                  <RedeemInvite />
                </Route>
                <PrivateRoute exact path="/checkout">
                  <Checkout />
                </PrivateRoute>
                <Route path="/success">
                  <Success />
                </Route>
                <Route path="/canceled">
                  <Canceled />
                </Route>
                <PrivateRoute2 path="/receivers">
                  <Receivers />
                </PrivateRoute2>
                <Redirect to='/dashboard' />
              </Switch>
            </Router>
          );
        }}
      </CacheBuster>
    );
  }
}

export default App;
