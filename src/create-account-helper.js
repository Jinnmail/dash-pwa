export const postCreateUser = async (email, password) => {
  const res = await fetch(`${process.env.REACT_APP_API_2}/user`, {
    method: 'POST', 
    headers: {'Content-type': 'application/json'}, 
    body: JSON.stringify({email: email, password: password})
  })

  return res;
}