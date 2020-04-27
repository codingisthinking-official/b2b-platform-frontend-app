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

  logout() {
    sessionStorage.setItem('jwtToken', '');
  }
}

export default new AuthenticationService()
