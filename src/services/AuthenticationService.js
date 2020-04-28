class AuthenticationService {
  isAuthenticated() {
    return sessionStorage.getItem('jwtToken');
  }

  authenticateWithToken(token) {
    sessionStorage.setItem('jwtToken', token);
  }

  getJwtToken() {
    return sessionStorage.getItem('jwtToken');
  }

  setUser(user) {
    sessionStorage.setItem('userDetails', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('userDetails'));
  }

  logout() {
    sessionStorage.setItem('jwtToken', '');
  }
}

export default new AuthenticationService()
