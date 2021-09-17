
export const postVerify = async (email, inputNumber) => {
  const res = await fetch(`${process.env.REACT_APP_API}/user/code/verify`, {
    method: 'POST', 
    headers: {'Content-type': 'application/json'}, 
    body: JSON.stringify({email: localStorage.getItem('email'), code: inputNumber})
  })

  return res;
}