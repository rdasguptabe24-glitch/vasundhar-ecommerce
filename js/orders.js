const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first.");
  window.location.href = "login.html";
}

const ordersContainer = document.getElementById("ordersContainer");

async function loadOrders() {
  try {
    const response = await fetch("https://vasundhar-ecommerce-production.up.railway.app/orders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const orders = await response.json();

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {
      ordersContainer.innerHTML = "<h2>No orders yet.</h2>";

      return;
    }

    orders.forEach((order) => {
      let itemsHTML = "";

      order.items.forEach((item) => {
        itemsHTML += `
                    <p>
                        ${item.name} × ${item.quantity}
                    </p>
                `;
      });

      ordersContainer.innerHTML += `

                <div class="order-card">

                    <h2>Order</h2>

                    ${itemsHTML}

                    <h3>Total: ₹${order.total}</h3>

                    <p>
                        ${new Date(order.createdAt).toLocaleString()}
                    </p>

                </div>

            `;
    });
  } catch (error) {
    console.error(error);
  }
}

loadOrders();
