export const loggedIn = () => {
  if (localStorage.getItem('jinnmailToken')) {
    const jinnmailToken = localStorage.getItem('jinnmailToken');
    const jinnmailTokenExp = JSON.parse(atob(jinnmailToken.split('.')[1])).exp;
    if (Date.now() < jinnmailTokenExp * 1000) {
      return true;
    } else {
      return false;
    }
  }
  
  return false;
}

export const logOut = () => {
  localStorage.removeItem('jinnmailToken');
}
