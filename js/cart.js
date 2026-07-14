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

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Create Razorpay Order
    const orderResponse = await fetch(
      "https://vasundhar-ecommerce-production.up.railway.app/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      },
    );

    const data = await orderResponse.json();

    const order = data.order;

    const total = data.total;

    const options = {
      key: "rzp_test_TDR1xb0tCF0iVn",

      amount: order.amount,

      currency: order.currency,

      order_id: order.id,

      name: "Vasundhara",

      description: "Order Payment",

      handler: async function (response) {
        const verifyResponse = await fetch(
          "https://vasundhar-ecommerce-production.up.railway.app/verify-payment",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },

            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              items: cart,

              total: total,
            }),
          },
        );

        const result = await verifyResponse.json();

        if (result.success) {
          alert("Payment Successful!");

          localStorage.removeItem("cart");

          window.location.href = "myorders.html";
        } else {
          alert("Payment Verification Failed!");
        }
      },

      theme: {
        color: "#7a1f1f",
      },
    };

    const rzp = new Razorpay(options);

    rzp.open();
  });
}
