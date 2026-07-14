const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const grandTotal = document.getElementById("grand-total");
const checkoutBtn = document.getElementById("checkoutBtn");

let products = [];

async function loadCart() {
  try {
    const response = await fetch(
      "https://vasundhar-ecommerce-production.up.railway.app/products",
    );

    products = await response.json();

    renderCart();
  } catch (err) {
    console.error(err);

    alert("Unable to load products.");
  }
}

function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p._id === item.id);

    if (!product) return;

    total += product.price * item.quantity;

    cartItems.innerHTML += `

<div class="cart-card">

<div class="cart-product">

<img
src="https://vasundhar-ecommerce-production.up.railway.app/products/${product.image}"
width="100">

<div>

<h3>${product.name}</h3>

<p>₹${product.price}</p>

</div>

</div>

<div class="quantity">

<button onclick="decrease('${item.id}')">-</button>

<span>${item.quantity}</span>

<button onclick="increase('${item.id}')">+</button>

</div>

<button
class="remove"
onclick="removeProduct('${item.id}')">

Remove

</button>

</div>

`;
  });

  grandTotal.innerText = "Total : ₹" + total;
}

function increase(id) {
  const product = cart.find((item) => item.id === id);

  product.quantity++;

  saveCart();
}

function decrease(id) {
  const product = cart.find((item) => item.id === id);

  if (product.quantity > 1) product.quantity--;

  saveCart();
}

function removeProduct(id) {
  const index = cart.findIndex((item) => item.id === id);

  cart.splice(index, 1);

  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");

      window.location.href = "login.html";

      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty.");

      return;
    }

    try {
      const orderResponse = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          items: cart,
        }),
      });

      console.log("Status:", orderResponse.status);

      const data = await orderResponse.json();

      console.log("Response:", data);

      const order = data.order;

      const options = {
        key: "rzp_test_TDR1xb0tCF0iVn",

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "Vasundhara",

        description: "Order Payment",

        handler: async function (response) {
          const verify = await fetch(
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
              }),
            },
          );

          const result = await verify.json();

          if (result.success) {
            alert("Payment Successful!");

            localStorage.removeItem("cart");

            window.location.href = "myorders.html";
          } else {
            alert(result.message);
          }
        },

        theme: {
          color: "#7a1f1f",
        },
      };

      const rzp = new Razorpay(options);

      rzp.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Unable to initiate payment. Check the browser console (F12).");
    }
  });
}

loadCart();
