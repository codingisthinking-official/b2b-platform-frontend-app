class AuthenticationService {
  isAuthenticated() {
    return sessionStorage.getItem('jwtToken');
  }
  authenticateWithToken(token) {
    sessionStorage.setItem('jwtToken', token);
  }
  logout() {
    sessionStorage.setItem('jwtToken', '');
  }
}

export default new AuthenticationService()
