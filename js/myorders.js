const container = document.getElementById("ordersContainer");

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login.");

  window.location.href = "login.html";
}

fetch("https://vasundhar-ecommerce-production.up.railway.app/orders/my", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => res.json())

  .then((orders) => {
    if (orders.length === 0) {
      container.innerHTML = "<h2>No orders found.</h2>";

      return;
    }

    orders.forEach((order) => {
      container.innerHTML += `

        <div class="order-card">

            <h2>Order ID</h2>

            <p>${order._id}</p>

            <h3>Status : ${order.status}</h3>

            <h3>Total : ₹${order.total}</h3>

            <p>${new Date(order.createdAt).toLocaleDateString()}</p>

        </div>

        `;
    });
  });
