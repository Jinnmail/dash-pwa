
export const postLogin = async (email, password) => {
  const res = await fetch(`${process.env.REACT_APP_API}/user/session`, {
    method: 'post', 
    headers: {'Content-type': 'application/json'}, 
    body: JSON.stringify({email: email, password: password})
  })

  return res;
}
