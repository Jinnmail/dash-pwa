import React, { useEffect } from 'react';
import {Redirect, useParams, withRouter} from 'react-router-dom';

function X(props) {
  const { token } = useParams();

  localStorage.setItem('jinnmailToken', token)

  if (localStorage.getItem('jinnmailToken')) {
    props.history.push('/dashboard')
    return <div></div>
  } else {
    return <div></div>
  }

}

export default withRouter(X);