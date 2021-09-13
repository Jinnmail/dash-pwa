import React from 'react';

class loginUtil {

  loggedIn = () => {
    if (localStorage.getItem('jinnmailToken')) {
      const jinnmailToken = localStorage.getItem('jinnmailToken');
      const jinnmailTokenExp = JSON.parse(atob(jinnmailToken.split('.')[1])).exp;
      if (Date.now() < jinnmailTokenExp * 1000) {
        return true;
      } else {
        return false;
      }
    }
  }

  logOut = () => {
    localStorage.removeItem('jinnmailToken');
  }
}

export const LoginUtil = new loginUtil(); 