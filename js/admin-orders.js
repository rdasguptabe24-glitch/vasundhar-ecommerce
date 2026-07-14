const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const container = document.getElementById("ordersContainer");

async function loadOrders() {
  const response = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const orders = await response.json();

  container.innerHTML = "";

  orders.forEach((order) => {
    let products = "";

    order.items.forEach((item) => {
      products += `
                <li>
                    ${item.name} × ${item.quantity}
                </li>
            `;
    });

    container.innerHTML += `

        <div class="order-card">

            <h2>${order.user.name}</h2>

            <p>${order.user.email}</p>

            <ul>

                ${products}

            </ul>

            <h3>Total : ₹${order.total}</h3>

            <p>

Status:

<select onchange="updateStatus('${order._id}', this.value)">

    <option value="Pending"
        ${order.status === "Pending" ? "selected" : ""}>
        Pending
    </option>

    <option value="Processing"
        ${order.status === "Processing" ? "selected" : ""}>
        Processing
    </option>

    <option value="Shipped"
        ${order.status === "Shipped" ? "selected" : ""}>
        Shipped
    </option>

    <option value="Delivered"
        ${order.status === "Delivered" ? "selected" : ""}>
        Delivered
    </option>

    <option value="Cancelled"
        ${order.status === "Cancelled" ? "selected" : ""}>
        Cancelled
    </option>

</select>

</p>

        </div>

        `;
  });
}

loadOrders();

async function updateStatus(orderId, status) {
  const response = await fetch(
    `${API_BASE_URL}/admin/orders/${orderId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert("Status Updated Successfully!");
}
