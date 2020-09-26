const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken')
  if (token) { console.log('hi user!'); return true } else { return false; }
}

export default isAuthenticated; 