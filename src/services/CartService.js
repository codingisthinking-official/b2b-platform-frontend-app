class CartService {
  addToCart(product, quantity) {
    let cart = this.getCart();

    if (!cart) {
      cart = [];
    }

    cart.push({
      'id': product.id,
      'quantity': quantity,
      'product': product,
    });

    sessionStorage.setItem("user--cart", JSON.stringify(cart));
  }

  removeProduct(product) {

    let cart = this.getCart();

    if (!cart) {
      return false;
    }

    let index = -1;
    cart.forEach((c, i) => {
      if (c.id === product.id) {
        index = i;
      }
    });

    cart.splice(index, 1);
    sessionStorage.setItem("user--cart", JSON.stringify(cart));
  }

  alreadyInCart(product) {
    let cart = this.getCart();

    if (!cart) {
      return false;
    }

    let inCart = false;
    cart.forEach((c) => {
      if (c.id === product.id) {
        inCart = true;
      }
    });

    return inCart;
  }

  getCart() {
    return JSON.parse(sessionStorage.getItem('user--cart'));
  }

  refine() {
    sessionStorage.setItem('user--cart', JSON.stringify([]));
  }
}

export default new CartService()
