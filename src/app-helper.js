export const getUserId = () => {
  let userId = ''

  let tokenStr = localStorage.getItem("jinnmailToken")?.split('.')[1];
  
  if (tokenStr) {
    tokenStr = Buffer.from(tokenStr, 'base64').toString()
    userId = JSON.parse(tokenStr).userId
  }

  return userId
}

export const getUser = async (userId) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API}/user/${userId}`, {
      method: 'GET',
      headers: {'Authorization': localStorage.getItem("jinnmailToken")},
    })
    return res;
  } catch (err) {
    throw new Error(err);
  }
}
