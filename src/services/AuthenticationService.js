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

  isSupplier() {
    return (this.getUser().type === 1);
  }

  logout() {
    sessionStorage.setItem('jwtToken', '');
    sessionStorage.setItem('userDetails', JSON.stringify([]));
  }
}

export default new AuthenticationService()
