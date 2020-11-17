//selecting the cart button
const cartBtn =  document.querySelector('.cart-btn');
const closeCartBtn =  document.querySelector('.close-cart');
const clearCartBtn =  document.querySelector('.clear-btn');
const cartDOM =  document.querySelector('.cart');
const cartOverlay =  document.querySelector('.cart-overlay');
const cartItems =  document.querySelector('.cart-items');
const cartTotal =  document.querySelector('.cart-total');
const cartContent =  document.querySelector('.cart-content');
const productDoM =  document.querySelector('.products-center');


//CART: This will be our main cart.Where we will be placing information.Getting information from localStorage
const cart =  [];

//