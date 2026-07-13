const cart = JSON.parse(localStorage.getItem("cart")) || [];

console.log(cart);

const cartItems = document.getElementById("cart-items");

const grandTotal = document.getElementById("grand-total");

let total = 0;

cart.forEach((product) => {
  total += product.price * product.quantity;

  cartItems.innerHTML += `
<div class="cart-card">

    <div class="cart-product">

    <img src="https://vasundhar-ecommerce-production.up.railway.app/uploads/${product.image}" width="100">

    <div>

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

    </div>

</div>

    <div class="quantity">

        <button onclick="decrease('${product.name}')">-</button>

        <span>${product.quantity}</span>

        <button onclick="increase('${product.name}')">+</button>

    </div>

    <button class="remove"
            onclick="removeProduct('${product.name}')">

        Remove

    </button>

</div>
`;
});

grandTotal.innerText = "Total : ₹" + total;

function increase(name) {
  const product = cart.find((item) => item.name === name);

  product.quantity++;

  saveCart();
}

function decrease(name) {
  const product = cart.find((item) => item.name === name);

  if (product.quantity > 1) {
    product.quantity--;
  }

  saveCart();
}

function removeProduct(name) {
  const index = cart.findIndex((item) => item.name === name);

  cart.splice(index, 1);

  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  location.reload();
}

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");

      window.location.href = "login.html";

      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");

      return;
    }

    const total = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    try {
      const response = await fetch("https://vasundhar-ecommerce-production.up.railway.app/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          items: cart,

          total: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);

        return;
      }

      alert("Order placed successfully!");

      localStorage.removeItem("cart");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  });
}
