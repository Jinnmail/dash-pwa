import React, { useEffect, useReducer } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {Box, Button, Grid, Hidden} from '@material-ui/core';
import NavBar from './NavBar';
import { loggedIn } from './LoginUtil';

const fetchCheckoutSession = async ({ quantity }) => {
  return fetch(`${process.env.REACT_APP_API}/payment/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('jinnmailToken')
    },
    body: JSON.stringify({
      quantity,
    }),
  }).then((res) => res.json());
};

const formatPrice = ({ amount, currency, quantity }) => {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  const total = (quantity * amount).toFixed(2);
  return numberFormat.format(total);
};

function reducer(state, action) {
  switch (action.type) {
    case 'useEffectUpdate':
      return {
        ...state,
        ...action.payload,
        price: formatPrice({
          amount: action.payload.unitAmount,
          currency: action.payload.currency,
          quantity: state.quantity,
        }),
      };
    case 'setLoading':
      return { ...state, loading: action.payload.loading };
    case 'setError':
      return { ...state, error: action.payload.error };
    default:
      throw new Error();
  }
}

const Checkout = () => {
  const [state, dispatch] = useReducer(reducer, {
    quantity: 1,
    price: null,
    loading: false,
    error: null,
    stripe: null,
  });

  useEffect(() => {
    async function fetchConfig() {
      const { publicKey, unitAmount, currency } = await fetch(
        `${process.env.REACT_APP_API}/payment/config`
      ).then((res) => res.json());
      dispatch({
        type: 'useEffectUpdate',
        payload: { unitAmount, currency, stripe: await loadStripe(publicKey) },
      });
    }
    fetchConfig();
  }, []);

  const handleClick = async (event) => {
    dispatch({ type: 'setLoading', payload: { loading: true } });
    const { sessionId } = await fetchCheckoutSession({
      quantity: state.quantity,
    });
    const { error } = await state.stripe.redirectToCheckout({
      sessionId,
    });
    if (error) {
      dispatch({ type: 'setError', payload: { error } });
      dispatch({ type: 'setLoading', payload: { loading: false } });
    }
  };

  return (
    <Grid 
      container
      direction="row"
      justify="center"
      alignItmes="center"
      spacing={2}
    >
      <Grid item xs={12}>{loggedIn() && <NavBar />}</Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={6} md={4} style={{textAlign: 'center'}}>
        <Grid container>
          <Grid item xs={12}>
            <h2 style={{margin: 0}}>One-time: $9</h2>
            <div>&nbsp;</div>
            An awesome 42 fat features and 7GB of power
          </Grid>
          <Grid item xs={12}>
            &nbsp;
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              // role="link"
              fullWidth
              onClick={handleClick}
              disabled={!state.stripe || state.loading}
            >
              {state.loading || !state.price
                ? `Loading...`
                : 'Go Premium'
                // : `Buy for ${state.price}`
              }
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
};

export default Checkout;

{/* <Grid item xs={12}>
  <Hidden lgUp>
    <img
      data-teset-id="x"
      alt="Random asset from Picsum"
      src="logo.png"
      style={{width: '100%', height: 'auto'}}
    />
  </Hidden>
  <Hidden mdDown>
    <img
      data-test-id="y"
      alt="Random asset from Picsum"
      src="logo.png"
      style={{width: '70%', height: 'auto'}}
    />
  </Hidden>
</Grid> */}
