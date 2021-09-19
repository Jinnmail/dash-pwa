import React, { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import CreateAccount from './CreateAccount';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
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

const App = () => {
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
        const res = await getUser(userId)
        const json = await res.json();
        setPaid(json.premium);
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
  
  return (
    <div>
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
            <Login />
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
            <Login />
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
          <Redirect to='/dashboard' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
