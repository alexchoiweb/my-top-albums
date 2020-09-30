const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken')
  // check token expiration date vs Date.now here
  if (token) { return true } else { return false; }
}

export default isAuthenticated; 