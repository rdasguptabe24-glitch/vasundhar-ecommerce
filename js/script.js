let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");

if (cartCount) {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalQuantity;
}