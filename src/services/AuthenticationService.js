class AuthenticationService {
  isAuthenticated() {
    return sessionStorage.getItem('jwtToken');
  }
  authenticateWithToken(token) {
    sessionStorage.setItem('jwtToken', token);
  }
}

export default new AuthenticationService()
