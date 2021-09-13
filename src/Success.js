import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Box, Button, Grid, Hidden} from '@material-ui/core';

const Success = (props) => {
  const [session, setSession] = useState({});
  const [email, setEmail] = useState('');
  const location = useLocation();
  const sessionId = location.search.replace('?session_id=', '');

  useEffect(() => {
    async function fetchSession() {
      setSession(
        await fetch(`${process.env.REACT_APP_API}/payment/checkout-session?sessionId=${sessionId}`).then((res) =>
          res.json()
        ).then(session => {
          const customerId = session.customer
          fetch(`${process.env.REACT_APP_API}/user/${customerId}`, {
            method: 'PUT', 
            headers: {
              'Content-type': 'application/json', 
              'Authorization': localStorage.getItem("jinnmailToken")
            }, 
            body: JSON.stringify({customerId: customerId, premium: true})
          })
          .then(res => res.json())
          .then(json => {
            setEmail(json.data.email);
            console.log("premium")
            // props.setRedirectTrue();
          })
        })
      );
    }
    fetchSession();
  }, [sessionId]);

  return (
    <Grid container style={{textAlign: 'center'}}>
       <Grid item xs={2}></Grid>
      <Grid item xs={8}>
        <h1 style={{margin: 0}}>Success! You now have Premium FOR LIFE for</h1>
        [{email}]
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={6}>
          <Link to="/dashboard">Jinnmail Dashboard</Link>
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
};

export default Success;
